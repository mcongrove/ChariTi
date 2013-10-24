/**
 * YouTube model
 * 
 * @class Models.youtube
 * @uses core
 * @uses http
 * @uses utilities
 */
var APP = require("core");
var HTTP = require("http");
var UTIL = require("utilities");

function Model() {
	var TID;
	var ApiBase = null;
	var Username = null;

	/**
	 * Initializes the model
	 * @param {Number} _id The UID of the component
	 */
	this.init = function(_id) {
		APP.log("debug", "YOUTUBE.init(" + _id + ")");

		TID = _id;

		var db = Ti.Database.open("ChariTi");

		db.execute("CREATE TABLE IF NOT EXISTS youtube_" + TID + " (id TEXT PRIMARY KEY, title TEXT, description TEXT, date TEXT, views TEXT, link TEXT, image TEXT);");

		db.close();
	};

	/**
	 * Sets the username for future requests
	 * @param {Object} _params The request paramaters to send
	 * @param {String} _params.username The username to retrieve videos from
	 * @param {Function} _params.callback The function to run on data retrieval
	 */
	this.setUsername = function(_params) {
		APP.log("debug", "YOUTUBE.setUsername");

		ApiBase = "http://gdata.youtube.com/feeds/mobile/users/" + _params.username + "/uploads?alt=json&format=1&safeSearch=none&v=2&";

		if(Ti.App.Properties.hasProperty("YOUTUBE_USERID")) {
			_params.callback();

			return;
		}

		Ti.App.Properties.setString("YOUTUBE_USERID", _params.username);

		_params.callback();
	};

	/**
	 * Fetches the remote data
	 * @param {Object} _params The request paramaters to send
	 * @param {Function} _params.callback The function to run on data retrieval
	 * @param {Function} _params.error The function to run on error
	 * @param {Number} _params.cache The length of time to consider cached data 'warm'
	 */
	this.fetch = function(_params) {
		APP.log("debug", "YOUTUBE.retrieveVideos");

		var isStale = UTIL.isStale(ApiBase + "max-results=20", _params.cache);

		if(isStale) {
			if(_params.cache !== 0 && isStale !== "new") {
				_params.callback();
			}

			HTTP.request({
				timeout: 10000,
				type: "GET",
				format: "JSON",
				url: ApiBase + "max-results=20",
				passthrough: _params.callback,
				success: this.handleData,
				failure: _params.error
			});
		} else {
			_params.callback();
		}
	};

	/**
	 * Handles the data return
	 * @param {Object} _data The returned data
	 * @param {String} _url The URL of the remote source
	 * @param {Function} _callback The function to run on data retrieval
	 */
	this.handleData = function(_data, _url, _callback) {
		APP.log("debug", "YOUTUBE.handleData");

		if(_data.feed.entry.length > 0) {
			var db = Ti.Database.open("ChariTi");

			db.execute("DELETE FROM youtube_" + TID + ";");
			db.execute("BEGIN TRANSACTION;");

			for(var i = 0, x = _data.feed.entry.length; i < x; i++) {
				var video = _data.feed.entry[i];

				var id = UTIL.escapeString(video.media$group.yt$videoid.$t);
				var title = UTIL.cleanEscapeString(video.title.$t);
				var description = UTIL.cleanEscapeString(video.media$group.media$description.$t);
				var date = UTIL.escapeString(video.published.$t.split("T")[0].replace(/-/g, "/") + " " + video.published.$t.split("T")[1].split(".")[0]);
				var views = UTIL.escapeString(video.yt$statistics && video.yt$statistics.viewCount ? video.yt$statistics.viewCount : "0");
				var link = UTIL.escapeString("http://www.youtube.com/watch?v=" + video.media$group.yt$videoid.$t);
				var image = UTIL.escapeString(video.media$group.media$thumbnail[0].url);

				db.execute("INSERT OR ABORT INTO youtube_" + TID + " (id, title, description, date, views, link, image) VALUES (" + id + ", " + title + ", " + description + ", " + date + ", " + views + ", " + link + ", " + image + ");");
			}

			db.execute("INSERT OR REPLACE INTO updates (url, time) VALUES(" + UTIL.escapeString(_url) + ", " + new Date().getTime() + ");");
			db.execute("END TRANSACTION;");
			db.close();
		}

		if(_callback) {
			_callback();
		}
	};

	/**
	 * Retrieves all videos
	 */
	this.getVideos = function() {
		APP.log("debug", "YOUTUBE.getVideos");

		var db = Ti.Database.open("ChariTi");
		var data = db.execute("SELECT id, title, date, link FROM youtube_" + TID + " ORDER BY date DESC;");
		var temp = [];

		while(data.isValidRow()) {
			temp.push({
				id: data.fieldByName("id"),
				title: data.fieldByName("title"),
				date: data.fieldByName("date"),
				link: data.fieldByName("link")
			});

			data.next();
		}

		data.close();
		db.close();

		return temp;
	};
}

module.exports = function() {
	return new Model();
};
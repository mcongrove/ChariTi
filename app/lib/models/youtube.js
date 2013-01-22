var APP		= require("core");
var HTTP	= require("http");
var UTIL	= require("utilities");

var ApiBase		= null;
var Username	= null;

var init = function() {
	APP.log("debug", "YOUTUBE.init");
	
	var db = Ti.Database.open("ChariTi");
	
	db.execute("CREATE TABLE IF NOT EXISTS youtube (id TEXT PRIMARY KEY, title TEXT, description TEXT, date TEXT, views TEXT, link TEXT, image TEXT);");
	
	db.close();
};

exports.setUsername = function(_params) {
	APP.log("debug", "YOUTUBE.setUsername");
	
	ApiBase = "http://gdata.youtube.com/feeds/mobile/users/" + _params.username + "/uploads?alt=json&format=1&safeSearch=none&v=2&";
	
	if(Ti.App.Properties.hasProperty("YOUTUBE_USERID")) {
		_params.callback();
		
		return;
	}
	
	Ti.App.Properties.setString("YOUTUBE_USERID", _params.username);
	
	_params.callback();
};

exports.fetch = function(_params) {
	APP.log("debug", "YOUTUBE.retrieveVideos");
	
	if(UTIL.isStale(ApiBase + "max-results=20", _params.cache)) {
		HTTP.request({
			timeout: 10000,
			type: "GET",
			format: "JSON",
			url: ApiBase + "max-results=20",
			passthrough: _params.callback,
			success: exports.handleData,
			failure: function(_error) {
				var alert = Ti.UI.createAlertDialog({
					title: "Connection Error",
					message: "The request has timed out.",
					buttonNames: [ "Retry", "Cancel" ],
					cancel: 1
				});
				
				alert.addEventListener("click", function(_event) {
					if(_event.index != _event.source.cancel) {
						exports.fetch(_params);
					} else {
						_params.callback();
					}
				});
				
				alert.show();
			}
		});
	} else {
		_params.callback();
	}
};

exports.handleData = function(_data, _url, _callback) {
	APP.log("debug", "YOUTUBE.handleData");
	
	if(_data.feed.entry.length > 0) {
		var db = Ti.Database.open("ChariTi");
		
		db.execute("DELETE FROM youtube;");
		db.execute("BEGIN TRANSACTION;");
		
		for(var i = 0, x = _data.feed.entry.length; i < x; i++) {
			var video		= _data.feed.entry[i];
			
			var id			= UTIL.escapeString(video.media$group.yt$videoid.$t);
			var title		= UTIL.cleanEscapeString(video.title.$t);
			var description	= UTIL.cleanEscapeString(video.media$group.media$description.$t);
			var date		= UTIL.escapeString(video.published.$t.split("T")[0].replace(/-/g, "/") + " " + video.published.$t.split("T")[1].split(".")[0]);
			var views		= UTIL.escapeString(video.yt$statistics && video.yt$statistics.viewCount ? video.yt$statistics.viewCount : "0");
			var link		= UTIL.escapeString("http://www.youtube.com/watch?v=" + video.media$group.yt$videoid.$t);
			var image		= UTIL.escapeString(video.media$group.media$thumbnail[0].url);
			
			db.execute("INSERT OR ABORT INTO youtube (id, title, description, date, views, link, image) VALUES (" + id + ", " + title + ", " + description + ", " + date + ", " + views + ", " + link + ", " + image + ");");
		}
		
		db.execute("INSERT OR REPLACE INTO updates (url, time) VALUES(" + UTIL.escapeString(_url) + ", " + new Date().getTime() + ");");
		db.execute("END TRANSACTION;");
		db.close();
	}
	
	if(_callback) {
		_callback();
	}
};

exports.getVideos = function() {
	APP.log("debug", "YOUTUBE.getVideos");
	
	var db		= Ti.Database.open("ChariTi");
	var data	= db.execute("SELECT id, title, date, link FROM youtube ORDER BY date DESC;");
	var temp	= [];

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

init();
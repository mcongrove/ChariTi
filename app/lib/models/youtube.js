var HTTP = require("http");
var UTIL = require("utilities");

var ApiBase = null;
var Username = null;

var init = function() {
	Ti.API.debug("YOUTUBE.init");
	
	var db = Ti.Database.open("Charitti");
	
	db.execute("CREATE TABLE IF NOT EXISTS youtube (id TEXT PRIMARY KEY, title TEXT, description TEXT, date TEXT, views TEXT, link TEXT, image TEXT);");
	
	db.close();
};

exports.setUsername = function(_params) {
	Ti.API.debug("YOUTUBE.setUsername");
	
	ApiBase = "http://gdata.youtube.com/feeds/mobile/users/" + _params.username + "/uploads?alt=json&format=1&safeSearch=none&v=2&";
	
	if(Ti.App.Properties.hasProperty("YOUTUBE_USERID")) {
		_params.callback();
		
		return;
	}
	
	Ti.App.Properties.setString("YOUTUBE_USERID", _params.username);
	
	_params.callback();
};

exports.isStale = function(_url) {
	var db = Ti.Database.open("Charitti");
	var freshTime = new Date().getTime() - 3600000;
	var lastUpdate = 0;
	
	var data = db.execute("SELECT time FROM updates WHERE url = " + UTIL.escapeString(_url) + " ORDER BY time DESC LIMIT 1;");
	
	while(data.isValidRow()) {
		lastUpdate = data.fieldByName("time");

		data.next();
	}
	
	data.close();
	db.close();
	
	if(lastUpdate > freshTime) {
		return false;
	} else {
		return true;
	}
};

exports.retrieveVideos = function(_params) {
	Ti.API.debug("YOUTUBE.retrieveVideos");
	
	if(exports.isStale(ApiBase + "max-results=20")) {
		HTTP.request({
			timeout: 10000,
			type: "GET",
			format: "JSON",
			url: ApiBase + "max-results=20",
			passthrough: _params.callback,
			success: exports.handleVideos
		});
	} else {
		_params.callback();
	}
};

exports.handleVideos = function(_data, _url, _callback) {
	Ti.API.debug("YOUTUBE.handleVideos");
	
	var db = Ti.Database.open("Charitti");
	
	if(_data.feed.entry.length > 1) {
		db.execute("DELETE FROM youtube;");
	}
	
	db.execute("BEGIN TRANSACTION;");
	
	for(var i = 0, x = _data.feed.entry.length; i < x; i++) {
		var video		= _data.feed.entry[i];
		
		var id			= UTIL.escapeString(video.media$group.yt$videoid.$t);
		var title		= UTIL.escapeString(video.title.$t);
		var description	= UTIL.escapeString(video.media$group.media$description.$t);
		var date		= UTIL.escapeString(video.published.$t.split("T")[0].replace(/-/g, "/") + " " + video.published.$t.split("T")[1].split(".")[0]);
		var views		= UTIL.escapeString(video.yt$statistics && video.yt$statistics.viewCount ? video.yt$statistics.viewCount : "0");
		var link		= UTIL.escapeString("http://www.youtube.com/watch?v=" + video.media$group.yt$videoid.$t);
		var image		= UTIL.escapeString(video.media$group.media$thumbnail[0].url);
		
		db.execute("INSERT OR ABORT INTO youtube (id, title, description, date, views, link, image) VALUES (" + id + ", " + title + ", " + description + ", " + date + ", " + views + ", " + link + ", " + image + ");");
	}
	
	db.execute("INSERT OR REPLACE INTO updates (url, time) VALUES(" + UTIL.escapeString(_url) + ", " + new Date().getTime() + ");");
	db.execute("END TRANSACTION;");
	db.close();
	
	if(_callback) {
		_callback();
	}
};

exports.getVideos = function() {
	Ti.API.debug("YOUTUBE.getVideos");
	
	var db		= Ti.Database.open("Charitti");
	var data	= db.execute("SELECT * FROM youtube ORDER BY date DESC;");
	var temp	= [];

	while(data.isValidRow()) {
		temp.push({
			id: data.fieldByName("id"),
			title: data.fieldByName("title"),
			description: data.fieldByName("description"),
			date: data.fieldByName("date"),
			views: data.fieldByName("views"),
			link: data.fieldByName("link"),
			image: data.fieldByName("image")
		});

		data.next();
	}

	data.close();
	db.close();

	return temp;
};

init();
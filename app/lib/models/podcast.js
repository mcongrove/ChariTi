var APP = require("core");
var HTTP = require("http");
var UTIL = require("utilities");

function Model() {
	var TID;

	this.init = function(_id) {
		APP.log("debug", "PODCAST.init(" + _id + ")");

		TID = _id;

		var db = Ti.Database.open("ChariTi");

		db.execute("CREATE TABLE IF NOT EXISTS podcast_" + TID + " (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, date TEXT, image TEXT, url TEXT);");

		db.close();
	};

	this.fetch = function(_params) {
		APP.log("debug", "PODCAST.fetch");
		APP.log("trace", JSON.stringify(_params));

		var isStale = UTIL.isStale(_params.url, _params.cache);

		if(isStale) {
			if(_params.cache !== 0 && isStale !== "new") {
				_params.callback();
			}

			HTTP.request({
				timeout: 10000,
				type: "GET",
				format: "TEXT",
				url: _params.url,
				passthrough: _params.callback,
				success: this.handleData,
				failure: _params.error
			});
		} else {
			_params.callback();
		}
	};

	this.handleData = function(_data, _url, _callback) {
		APP.log("debug", "PODCAST.handleData");

		var xml = Ti.XML.parseString(UTIL.xmlNormalize(_data));
		var nodes = xml.documentElement.getElementsByTagName("item");

		if(nodes.length > 0) {
			var db = Ti.Database.open("ChariTi");

			db.execute("DELETE FROM podcast_" + TID + ";");
			db.execute("BEGIN TRANSACTION;");

			for(var i = 0, x = nodes.length; i < x; i++) {
				var title = UTIL.cleanEscapeString(nodes.item(i).getElementsByTagName("title").item(0).text);
				var date = UTIL.escapeString(new Date(UTIL.cleanString(nodes.item(i).getElementsByTagName("pubDate").item(0).text)).getTime());
				var url = UTIL.cleanEscapeString(nodes.item(i).getElementsByTagName("media:content").item(0).attributes.getNamedItem("url").text);

				var image = null;

				if(nodes.item(i).getElementsByTagName("itunes:image").length > 0) {
					if(nodes.item(i).getElementsByTagName("itunes:image").item(0).attributes.getNamedItem("href")) {
						image = UTIL.escapeString(nodes.item(i).getElementsByTagName("itunes:image").item(0).attributes.getNamedItem("href").text);
					} else if(nodes.item(i).getElementsByTagName("itunes:image").item(0).attributes.getNamedItem("url")) {
						image = UTIL.escapeString(nodes.item(i).getElementsByTagName("itunes:image").item(0).attributes.getNamedItem("url").text);
					}
				}

				db.execute("INSERT INTO podcast_" + TID + " (id, title, date, image, url) VALUES (NULL, " + title + ", " + date + ", " + image + ", " + url + ");");
			}

			db.execute("INSERT OR REPLACE INTO updates (url, time) VALUES(" + UTIL.escapeString(_url) + ", " + new Date().getTime() + ");");
			db.execute("END TRANSACTION;");
			db.close();
		}

		if(_callback) {
			_callback();
		}
	};

	this.getAllPodcasts = function() {
		APP.log("debug", "PODCAST.getAllPodcasts");

		var db = Ti.Database.open("ChariTi");
		var data = db.execute("SELECT id, title, date FROM podcast_" + TID + " ORDER BY id ASC LIMIT 25;");
		var temp = [];

		while(data.isValidRow()) {
			temp.push({
				id: data.fieldByName("id"),
				title: data.fieldByName("title"),
				date: data.fieldByName("date")
			});

			data.next();
		}

		data.close();
		db.close();

		return temp;
	};

	this.getPodcast = function(_id) {
		APP.log("debug", "PODCAST.getPodcast");

		var db = Ti.Database.open("ChariTi");
		var data = db.execute("SELECT * FROM podcast_" + TID + " WHERE id = " + UTIL.cleanEscapeString(_id) + ";");
		var temp;

		while(data.isValidRow()) {
			temp = {
				id: data.fieldByName("id"),
				title: data.fieldByName("title"),
				date: data.fieldByName("date"),
				url: data.fieldByName("url"),
				image: null
			};

			if(data.fieldByName("image")) {
				temp.image = data.fieldByName("image");
			}

			data.next();
		}

		data.close();
		db.close();

		return temp;
	};
	
	this.downloadPodcast = function(_url) {
		APP.log("debug", "PODCAST.downloadPodcast(" + _url + ")");
		
		var filename = _url.substring(_url.lastIndexOf("/") + 1, _url.lastIndexOf(".mp3")) + ".mp3";
		var directory;
	
		if(OS_ANDROID) {
			directory = Ti.Filesystem.getFile(Ti.Filesystem.externalStorageDirectory);
		} else {
			directory = Ti.Filesystem.applicationDataDirectory;
		}
	
		var file = Ti.Filesystem.getFile(directory, filename);
	
		if(!file.exists()) {
			HTTP.request({
				timeout: 10000,
				type: "GET",
				format: "DATA",
				url: _url,
				success: function(_data) {
					file.write(data);
				}
			});
		}
	};

	this.getNextPodcast = function(_id) {
		APP.log("debug", "PODCAST.getNextPodcast");

		var db = Ti.Database.open("ChariTi");
		var data = db.execute("SELECT id FROM podcast_" + TID + " WHERE id > " + UTIL.cleanEscapeString(_id) + " ORDER BY id ASC LIMIT 1;");
		var temp;

		while(data.isValidRow()) {
			temp = {
				id: data.fieldByName("id")
			};

			data.next();
		}

		data.close();
		db.close();

		return temp;
	};

	this.getPreviousPodcast = function(_id) {
		APP.log("debug", "PODCAST.getPreviousPodcast");

		var db = Ti.Database.open("ChariTi");
		var data = db.execute("SELECT id FROM podcast_" + TID + " WHERE id < " + UTIL.cleanEscapeString(_id) + " ORDER BY id DESC LIMIT 1;");

		if(data.rowCount == 0) {
			data = db.execute("SELECT id FROM podcast_" + TID + " ORDER BY id DESC LIMIT 1;");
		}

		var temp;

		while(data.isValidRow()) {
			temp = {
				id: data.fieldByName("id")
			};

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
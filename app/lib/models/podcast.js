var APP = require("core");
var HTTP = require("http");
var UTIL = require("utilities");

function Model() {
	var TID;

	this.init = function(_id) {
		APP.log("debug", "PODCAST.init(" + _id + ")");

		TID = _id;

		var db = Ti.Database.open("ChariTi");

		db.execute("CREATE TABLE IF NOT EXISTS podcast_" + TID + " (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, date TEXT, image TEXT, description TEXT, url TEXT, link TEXT, favorite INTEGER);");

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
				failure: function(_error) {
					alert("Unable to connect. Please try again later.");
				}
			});
		} else {
			_params.callback();
		}
	};

	this.handleData = function(_data, _url, _passthrough) {
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
				var description = UTIL.cleanEscapeString(nodes.item(i).getElementsByTagName("description").item(0).text);
				var link = UTIL.cleanEscapeString(nodes.item(i).getElementsByTagName("link").item(0).text);

				if(nodes.item(i).getElementsByTagName("enclosure").length > 0) {
					url = UTIL.escapeString(nodes.item(i).getElementsByTagName("enclosure").item(0).getAttribute("url"));
				}

				var favorite = 0;

				var image = null;

				if(nodes.item(i).getElementsByTagName("itunes:image").length > 0) {
					if(nodes.item(i).getElementsByTagName("itunes:image").item(0).attributes.getNamedItem("href")) {
						image = UTIL.escapeString(nodes.item(i).getElementsByTagName("itunes:image").item(0).attributes.getNamedItem("href").text);
					} else if(nodes.item(i).getElementsByTagName("itunes:image").item(0).attributes.getNamedItem("url")) {
						image = UTIL.escapeString(nodes.item(i).getElementsByTagName("itunes:image").item(0).attributes.getNamedItem("url").text);
					}
				}

				db.execute("INSERT INTO podcast_" + TID + " (id, title, date, image, description, url, link, favorite) VALUES (NULL, " + title + ", " + date + ", " + image + ", " + description + ", " + url + ", " + link + ", " + favorite + ");");
			}

			db.execute("INSERT OR REPLACE INTO updates (url, time) VALUES(" + UTIL.escapeString(_url) + ", " + new Date().getTime() + ");");
			db.execute("END TRANSACTION;");
			db.close();
		}

		if(_passthrough) {
			_passthrough();
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
				description: data.fieldByName("description"),
				link: data.fieldByName("link"),
				url: data.fieldByName("url"),
				favorite: data.fieldByName("favorite"),
				image: null
			};

			if(data.fieldByName("image")) {
				temp.image = data.fieldByName("image");
			};

			// if(data.fieldByName("favorite")) {
			// temp.favorite = data.fieldByName("favorite");
			// };

			data.next();
		}

		data.close();
		db.close();

		return temp;
	};

	this.toggleFavorite = function(_id) {

		db = Titanium.Database.open('ChariTi');
		var data = db.execute("SELECT id, favorite FROM podcast_" + TID + " WHERE id = " + UTIL.cleanEscapeString(_id) + " LIMIT 1;");
		var flag = 0;
		if(data.isValidRow()) {

			var id = data.fieldByName("id");
			var favorite = data.fieldByName("favorite");

			if(favorite != 1) {
				Ti.API.info("id = " + id + " favorite is now = " + favorite);
				db.execute("UPDATE podcast_" + TID + " set favorite = 1 where id = " + UTIL.cleanEscapeString(_id) + ";");

			} else {
				Ti.API.info("id = " + id + " favorite is now = " + favorite);
				db.execute("UPDATE podcast_" + TID + " set favorite = 0 where id = " + UTIL.cleanEscapeString(_id) + ";");
			}
		}

		data.close();
		db.close();

		return favorite;

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
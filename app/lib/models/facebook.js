var APP = require("core");
var HTTP = require("http");
var UTIL = require("utilities");

function Model() {
	var TID;

	this.init = function(_id) {
		APP.log("debug", "FACEBOOK.init(" + _id + ")");

		TID = _id;

		var db = Ti.Database.open("ChariTi");

		db.execute("CREATE TABLE IF NOT EXISTS facebook_" + TID + " (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, date TEXT, description TEXT, link TEXT);");

		db.close();
	};

	this.fetch = function(_params) {
		APP.log("debug", "FACEBOOK.fetch");
		APP.log("trace", JSON.stringify(_params));

		var isStale = UTIL.isStale(_params.url, _params.cache);

		if(isStale) {
			if(_params.cache !== 0 && isStale !== "new") {
				_params.callback();
			}

			HTTP.request({
				timeout: 10000,
				type: "GET",
				format: "JSON",
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
		APP.log("debug", "FACEBOOK.handleData");

		if(_data.entries.length > 0) {
			var db = Ti.Database.open("ChariTi");

			db.execute("DELETE FROM facebook_" + TID + ";");
			db.execute("BEGIN TRANSACTION;");

			for(var i = 0, x = _data.entries.length; i < x; i++) {
				var article = _data.entries[i];

				var title = UTIL.cleanEscapeString(article.title);

				if(title.length > 2) {
					var date = article.published.split("T")[0].replace(/-/g, "/") + " " + article.published.split("T")[1].split("+")[0].split("-")[0];
					date = UTIL.escapeString(new Date(date).getTime());
					var description = UTIL.cleanEscapeString(article.content);
					var link = UTIL.cleanEscapeString(article.alternate);

					db.execute("INSERT INTO facebook_" + TID + " (id, title, date, description, link) VALUES (NULL, " + title + ", " + date + ", " + description + ", " + link + ");");
				}
			}

			db.execute("INSERT OR REPLACE INTO updates (url, time) VALUES(" + UTIL.escapeString(_url) + ", " + new Date().getTime() + ");");
			db.execute("END TRANSACTION;");
			db.close();
		}

		if(_callback) {
			_callback();
		}
	};

	this.getAllArticles = function() {
		APP.log("debug", "FACEBOOK.getAllArticles(" + TID + ")");

		var db = Ti.Database.open("ChariTi");
		var data = db.execute("SELECT id, title, date FROM facebook_" + TID + " ORDER BY id ASC LIMIT 25;");
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

	this.getArticle = function(_id) {
		APP.log("debug", "FACEBOOK.getArticle");

		var db = Ti.Database.open("ChariTi");
		var data = db.execute("SELECT * FROM facebook_" + TID + " WHERE id = " + UTIL.cleanEscapeString(_id) + ";");
		var temp;

		while(data.isValidRow()) {
			temp = {
				id: data.fieldByName("id"),
				title: data.fieldByName("title"),
				date: data.fieldByName("date"),
				description: data.fieldByName("description"),
				link: data.fieldByName("link")
			};

			data.next();
		}

		data.close();
		db.close();

		return temp;
	};

	this.getNextArticle = function(_id) {
		APP.log("debug", "FACEBOOK.getNextArticle");

		var db = Ti.Database.open("ChariTi");
		var data = db.execute("SELECT id FROM facebook_" + TID + " WHERE id > " + UTIL.cleanEscapeString(_id) + " ORDER BY id ASC LIMIT 1;");
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

	this.getPreviousArticle = function(_id) {
		APP.log("debug", "FACEBOOK.getPreviousArticle");

		var db = Ti.Database.open("ChariTi");
		var data = db.execute("SELECT id FROM facebook_" + TID + " WHERE id < " + UTIL.cleanEscapeString(_id) + " ORDER BY id DESC LIMIT 1;");

		if(data.rowCount == 0) {
			data = db.execute("SELECT id FROM facebook_" + TID + " ORDER BY id DESC LIMIT 1;");
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
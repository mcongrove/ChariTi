var HTTP = require("http");
var UTIL = require("utilities");

var init = function() {
	Ti.API.debug("NEWS.init");
	
	var db = Ti.Database.open("Charitti");
	
	db.execute("CREATE TABLE IF NOT EXISTS news (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, date TEXT, description TEXT, link TEXT);");
	
	db.close();
};

exports.fetch = function(_params) {
	Ti.API.debug("NEWS.fetch");
	Ti.API.info(JSON.stringify(_params));
	
	if(UTIL.isStale(_params.url, _params.cache)) {
		HTTP.request({
			timeout: 10000,
			type: "GET",
			format: "TEXT",
			url: _params.url,
			passthrough: _params.callback,
			success: exports.handleData,
			failure: function(_error) {
				var alert = Ti.UI.createAlertDialog({
					title: "Connection Error",
					message: "The request has timed out.",
					ok: "Retry"
				});
				
				alert.addEventListener("click", function(_data) {
					exports.fetch(_params);
				});
				
				alert.show();
			}
		});
	} else {
		_params.callback();
	}
};

exports.handleData = function(_data, _url, _passthrough) {
	Ti.API.debug("NEWS.handleData");
	
	var xml		= Ti.XML.parseString(UTIL.xmlNormalize(_data));
	var nodes	= xml.documentElement.getElementsByTagName("item");
	
	if(nodes.length > 0) {
		var db	= Ti.Database.open("Charitti");
		
		db.execute("DELETE FROM news;");
		db.execute("BEGIN TRANSACTION;");
		
		for(var i = 0, x = nodes.length; i < x; i++) {
			var title		= UTIL.cleanEscapeString(nodes.item(i).getElementsByTagName("title").item(0).text);
			var date		= UTIL.escapeString(new Date(UTIL.cleanString(nodes.item(i).getElementsByTagName("pubDate").item(0).text)).getTime());
			var description	= UTIL.cleanEscapeString(nodes.item(i).getElementsByTagName("description").item(0).text);
			var link		= UTIL.escapeString(nodes.item(i).getElementsByTagName("link").item(0).text);
			
			db.execute("INSERT INTO news (id, title, date, description, link) VALUES (NULL, " + title + ", " + date + ", " + description + ", " + link + ");");
		}
		
		db.execute("INSERT OR REPLACE INTO updates (url, time) VALUES(" + UTIL.escapeString(_url) + ", " + new Date().getTime() + ");");
		db.execute("END TRANSACTION;");
		db.close();
	}
	
	if(_passthrough) {
		_passthrough();
	}
};

exports.getAllArticles = function() {
	Ti.API.debug("NEWS.getAllArticles");
	
	var db		= Ti.Database.open("Charitti");
	var data	= db.execute("SELECT * FROM news ORDER BY date DESC;");
	var temp	= [];

	while(data.isValidRow()) {
		temp.push({
			id: data.fieldByName("id"),
			title: data.fieldByName("title"),
			date: data.fieldByName("date"),
			description: data.fieldByName("description"),
			link: data.fieldByName("link")
		});

		data.next();
	}

	data.close();
	db.close();

	return temp;
};

exports.getArticle = function(_id) {
	Ti.API.debug("NEWS.getArticle");
	
	var db		= Ti.Database.open("Charitti");
	var data	= db.execute("SELECT * FROM news WHERE id = " + UTIL.cleanEscapeString(_id) + ";");
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

init();
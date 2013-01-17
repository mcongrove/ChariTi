var APP = require("core");
var HTTP = require("http");
var UTIL = require("utilities");

var init = function() {
	APP.log("debug", "FACEBOOK.init");
	
	var db = Ti.Database.open("ChariTi");
	
	db.execute("CREATE TABLE IF NOT EXISTS facebook (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, date TEXT, description TEXT, link TEXT);");
	
	db.close();
};

exports.fetch = function(_params) {
	APP.log("debug", "FACEBOOK.fetch");
	APP.log("trace", JSON.stringify(_params));
	
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

exports.handleData = function(_data, _url, _passthrough) {
	APP.log("debug", "FACEBOOK.handleData");
	
	var xml		= Ti.XML.parseString(UTIL.xmlNormalize(_data));
	var nodes	= xml.documentElement.getElementsByTagName("item");
	
	if(nodes.length > 0) {
		var db	= Ti.Database.open("ChariTi");
		
		db.execute("DELETE FROM facebook;");
		db.execute("BEGIN TRANSACTION;");
		
		for(var i = 0, x = nodes.length; i < x; i++) {
			var title		= UTIL.cleanEscapeString(nodes.item(i).getElementsByTagName("title").item(0).text);
			
			if(title.length > 2) {
				var date		= UTIL.escapeString(new Date(UTIL.cleanString(nodes.item(i).getElementsByTagName("pubDate").item(0).text)).getTime());
				var description	= UTIL.cleanEscapeString(nodes.item(i).getElementsByTagName("description").item(0).text);
				var link		= UTIL.escapeString(nodes.item(i).getElementsByTagName("link").item(0).text);
				
				db.execute("INSERT INTO facebook (id, title, date, description, link) VALUES (NULL, " + title + ", " + date + ", " + description + ", " + link + ");");
			}
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
	APP.log("debug", "FACEBOOK.getAllArticles");
	
	var db		= Ti.Database.open("ChariTi");
	var data	= db.execute("SELECT * FROM facebook ORDER BY id ASC LIMIT 25;");
	var temp	= [];

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

exports.getArticle = function(_id) {
	APP.log("debug", "FACEBOOK.getArticle");
	
	var db		= Ti.Database.open("ChariTi");
	var data	= db.execute("SELECT * FROM facebook WHERE id = " + UTIL.cleanEscapeString(_id) + ";");
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

exports.getNextArticle = function(_id) {
	APP.log("debug", "FACEBOOK.getNextArticle");
	
	var db		= Ti.Database.open("ChariTi");
	var data	= db.execute("SELECT id FROM facebook WHERE id > " + UTIL.cleanEscapeString(_id) + " ORDER BY id ASC LIMIT 1;");
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

exports.getPreviousArticle = function(_id) {
	APP.log("debug", "FACEBOOK.getPreviousArticle");
	
	var db		= Ti.Database.open("ChariTi");
	var data	= db.execute("SELECT id FROM facebook WHERE id < " + UTIL.cleanEscapeString(_id) + " ORDER BY id DESC LIMIT 1;");
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

init();
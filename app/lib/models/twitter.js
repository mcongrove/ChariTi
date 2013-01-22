var APP = require("core");
var HTTP = require("http");
var UTIL = require("utilities");

var init = function() {
	APP.log("debug", "TWITTER.init");
	
	var db = Ti.Database.open("ChariTi");
	
	db.execute("CREATE TABLE IF NOT EXISTS twitter (id INTEGER PRIMARY KEY, text TEXT, date TEXT);");
	
	db.close();
};

exports.fetch = function(_params) {
	APP.log("debug", "TWITTER.fetch");
	APP.log("trace", JSON.stringify(_params));
	
	var isStale = UTIL.isStale(_params.url, _params.cache);
	
	if(isStale) {
		if (_params.cache !== 0 && isStale !== 'new') {
			_params.callback();
		}
		
		HTTP.request({
			timeout: 10000,
			type: "GET",
			format: "JSON",
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

exports.handleData = function(_data, _url, _callback) {
	APP.log("debug", "TWITTER.handleData");
	
	if(_data.length > 0) {
		var db = Ti.Database.open("ChariTi");
		
		db.execute("DELETE FROM twitter;");
		db.execute("BEGIN TRANSACTION;");
		
		for(var i = 0, x = _data.length; i < x; i++) {
			var tweet	= _data[i];
			
			var id		= UTIL.escapeString(tweet.id_str);
			var text	= UTIL.cleanEscapeString(tweet.text);
			var date	= UTIL.escapeString(new Date(tweet.created_at).getTime() + "");
			
			db.execute("INSERT OR ABORT INTO twitter (id, text, date) VALUES (" + id + ", " + text + ", " + date + ");");
		}
		
		db.execute("INSERT OR REPLACE INTO updates (url, time) VALUES(" + UTIL.escapeString(_url) + ", " + new Date().getTime() + ");");
		db.execute("END TRANSACTION;");
		db.close();
	}
	
	if(_callback) {
		_callback();
	}
};

exports.getTweets = function() {
	APP.log("debug", "TWITTER.getVideos");
	
	var db		= Ti.Database.open("ChariTi");
	var data	= db.execute("SELECT * FROM twitter ORDER BY date DESC;");
	var temp	= [];

	while(data.isValidRow()) {
		temp.push({
			id: data.fieldByName("id"),
			text: data.fieldByName("text"),
			date: data.fieldByName("date")
		});

		data.next();
	}

	data.close();
	db.close();

	return temp;
};

init();
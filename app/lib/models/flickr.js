var HTTP = require("http");
var UTIL = require("utilities");

var ApiBase = null;

var init = function() {
	var db = Ti.Database.open("Charitti");
	
	db.execute("CREATE TABLE IF NOT EXISTS flickr_sets (id TEXT PRIMARY KEY, title TEXT, date_create TEXT, date_update TEXT, description TEXT, photo_count TEXT);");
	db.execute("CREATE TABLE IF NOT EXISTS flickr_photos (id TEXT PRIMARY KEY, set_id TEXT, title TEXT, url_m TEXT, url_sq TEXT);");
	
	db.close();
};

exports.setApiKey = function(_key) {
	ApiBase = "http://api.flickr.com/services/rest/?api_key=" + _key + "&format=json&nojsoncallback=1&method=flickr.";
};

exports.generateNsid = function(_params) {
	if(Ti.App.Properties.hasProperty("FLICKR_NSID")) {
		_params.callback();
		
		return;
	}
	
	if(_params.username.indexOf("@") > 0) {
		exports.handleNsid({ user: { id: _params.username }}, null, _params.callback);
	} else {
		HTTP.request({
			timeout: 10000,
			type: "GET",
			format: "JSON",
			url: ApiBase + "urls.lookupUser&url=flickr.com%2Fphotos%2F" + _params.username,
			passthrough: _params.callback,
			success: exports.handleNsid
		});
	}
};

exports.handleNsid = function(_data, _url, _passthrough) {
	Ti.App.Properties.setString("FLICKR_NSID", _data.user.id);
	
	if(typeof _passthrough !== "undefined") {
		_passthrough();
	}
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

exports.retrieveSets = function(_params) {
	if(exports.isStale(ApiBase + "photosets.getList&user_id=" + Ti.App.Properties.getString("FLICKR_NSID"))) {
		HTTP.request({
			timeout: 10000,
			type: "GET",
			format: "JSON",
			url: ApiBase + "photosets.getList&user_id=" + Ti.App.Properties.getString("FLICKR_NSID"),
			passthrough: _params.callback,
			success: exports.handleSets
		});
	} else {
		_params.callback();
	}
};

exports.handleSets = function(_data, _url, _callback) {
	var db = Ti.Database.open("Charitti");
	
	if(_data.photosets.photoset.length > 1) {
		db.execute("DELETE FROM flickr_sets;");
		db.execute("DELETE FROM flickr_photos;");
	}
	
	db.execute("BEGIN TRANSACTION;");
	
	for(var i = 0, x = _data.photosets.photoset.length; i < x; i++) {
		var set			= _data.photosets.photoset[i];
		
		var id			= UTIL.escapeString(set.id);
		var title		= UTIL.escapeString(set.title["_content"]);
		var date_create	= UTIL.escapeString(set.date_create);
		var date_update	= UTIL.escapeString(set.date_update);
		var description	= UTIL.escapeString(set.description["_content"]);
		var photo_count	= UTIL.escapeString(set.photos);
		
		db.execute("INSERT OR REPLACE INTO flickr_sets (id, title, date_create, date_update, description, photo_count) VALUES (" + id + ", " + title + ", " + date_create + ", " + date_update + ", " + description + ", " + photo_count + ");");
	}
	
	db.execute("INSERT OR REPLACE INTO updates (url, time) VALUES(" + UTIL.escapeString(_url) + ", " + new Date().getTime() + ");");
	db.execute("END TRANSACTION;");
	db.close();
	
	if(_callback) {
		_callback();
	}
};

exports.retrieveSet = function(_params) {
	if(exports.isStale(ApiBase + "photosets.getPhotos&extras=url_sq,url_m&privacy_filter=1&media=photos&photoset_id=" + _params.id)) {
		HTTP.request({
			timeout: 10000,
			type: "GET",
			format: "JSON",
			url: ApiBase + "photosets.getPhotos&extras=url_sq,url_m&privacy_filter=1&media=photos&photoset_id=" + _params.id,
			passthrough: _params.callback,
			success: exports.handleSet
		});
	} else {
		_params.callback();
	}
};

exports.handleSet = function(_data, _url, _callback) {
	var db = Ti.Database.open("Charitti");
	
	db.execute("BEGIN TRANSACTION;");
	
	for(var i = 0, x = _data.photoset.photo.length; i < x; i++) {
		var photo		= _data.photoset.photo[i];
		var set_id		= _url.match(/photoset_id=(\d*)/i);
		
		var id			= UTIL.escapeString(photo.id);
		set_id			= UTIL.escapeString(set_id[1]);
		var title		= UTIL.escapeString(photo.title);
		var url_m		= UTIL.escapeString(photo.url_m);
		var url_sq		= UTIL.escapeString(photo.url_sq);
		
		db.execute("INSERT OR REPLACE INTO flickr_photos (id, set_id, title, url_m, url_sq) VALUES (" + id + ", " + set_id + ", " + title + ", " + url_m + ", " + url_sq + ");");
	}
	
	db.execute("INSERT OR REPLACE INTO updates (url, time) VALUES(" + UTIL.escapeString(_url) + ", " + new Date().getTime() + ");");
	db.execute("END TRANSACTION;");
	db.close();
	
	if(_callback) {
		_callback();
	}
};

exports.getSets = function() {
	var db		= Ti.Database.open("Charitti");
	var data	= db.execute("SELECT * FROM flickr_sets ORDER BY date_update DESC;");
	var temp	= [];

	while(data.isValidRow()) {
		temp.push({
			id: data.fieldByName("id"),
			title: data.fieldByName("title"),
			date_create: data.fieldByName("date_create"),
			date_update: data.fieldByName("date_update"),
			description: data.fieldByName("description"),
			photo_count: data.fieldByName("photo_count")
		});

		data.next();
	}

	data.close();
	db.close();

	return temp;
};

exports.getSet = function(_id) {
	var db		= Ti.Database.open("Charitti");
	var data	= db.execute("SELECT * FROM flickr_photos WHERE set_id = " + UTIL.cleanEscapeString(_id) + ";");
	var temp	= [];
	
	while(data.isValidRow()) {
		temp.push({
			id: data.fieldByName("id"),
			set_id: data.fieldByName("set_id"),
			title: data.fieldByName("title"),
			url_m: data.fieldByName("url_m"),
			url_sq: data.fieldByName("url_sq")
		});
		
		data.next();
	}

	data.close();
	db.close();

	return temp;
};

exports.getPhoto = function(_id) {
	var db		= Ti.Database.open("Charitti");
	var data	= db.execute("SELECT * FROM flickr_photos WHERE id = " + UTIL.cleanEscapeString(_id) + " LIMIT 1;");
	var temp	= [];
	
	while(data.isValidRow()) {
		temp = {
			id: data.fieldByName("id"),
			set_id: data.fieldByName("set_id"),
			title: data.fieldByName("title"),
			url_m: data.fieldByName("url_m"),
			url_sq: data.fieldByName("url_sq")
		};
		
		data.next();
	}

	data.close();
	db.close();

	return temp;
};

init();
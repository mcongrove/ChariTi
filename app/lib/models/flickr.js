/**
 * Flickr model
 * 
 * @class Models.flickr
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

	/**
	 * Initializes the model
	 * @param {Number} _id The UID of the component
	 */
	this.init = function(_id) {
		APP.log("debug", "FLICKR.init(" + _id + ")");

		TID = _id;

		var db = Ti.Database.open("ChariTi");

		db.execute("CREATE TABLE IF NOT EXISTS flickr_sets_" + TID + " (id TEXT PRIMARY KEY, title TEXT, date_create TEXT, date_update TEXT, description TEXT, photo_count TEXT);");
		db.execute("CREATE TABLE IF NOT EXISTS flickr_photos_" + TID + " (id TEXT PRIMARY KEY, set_id TEXT, indx TEXT, title TEXT, url_m TEXT, url_sq TEXT);");

		db.close();
	};

	/**
	 * Sets the API key for future requests
	 * @param {String} _key The API key
	 */
	this.setApiKey = function(_key) {
		APP.log("debug", "FLICKR.setApiKey");

		ApiBase = "http://api.flickr.com/services/rest/?api_key=" + _key + "&format=json&nojsoncallback=1&method=flickr.";
	};

	/**
	 * Retrieves the NSID
	 * @param {Object} _params The request paramaters to send
	 * @param {String} _params.username The username to retrieve photos from
	 * @param {Function} _params.callback The function to run on data retrieval
	 * @param {Function} _params.error The function to run on error
	 */
	this.generateNsid = function(_params) {
		APP.log("debug", "FLICKR.generateNsid");

		if(Ti.App.Properties.hasProperty("FLICKR_NSID")) {
			if(Ti.App.Properties.hasProperty("FLICKR_USERNAME") && Ti.App.Properties.getString("FLICKR_USERNAME") == _params.username) {
				_params.callback();

				return;
			}
		}

		Ti.App.Properties.setString("FLICKR_USERNAME", _params.username);

		if(_params.username.indexOf("@") > 0) {
			this.handleNsid({
				user: {
					id: _params.username
				}
			}, null, _params.callback);
		} else {
			HTTP.request({
				timeout: 10000,
				type: "GET",
				format: "JSON",
				url: ApiBase + "urls.lookupUser&url=flickr.com%2Fphotos%2F" + _params.username,
				passthrough: _params.callback,
				success: this.handleNsid,
				failure: _params.error
			});
		}
	};

	/**
	 * Handles the NSID data return
	 * @param {Object} _data The returned data
	 * @param {String} _url The URL of the remote source
	 * @param {Function} _callback The function to run on data retrieval
	 */
	this.handleNsid = function(_data, _url, _callback) {
		APP.log("debug", "FLICKR.handleNsid");

		Ti.App.Properties.setString("FLICKR_NSID", _data.user.id);

		if(typeof _callback !== "undefined") {
			_callback();
		}
	};

	/**
	 * Fetches the remote photo sets data
	 * @param {Object} _params The request paramaters to send
	 * @param {Function} _params.callback The function to run on data retrieval
	 * @param {Function} _params.error The function to run on error
	 * @param {Number} _params.cache The length of time to consider cached data 'warm'
	 */
	this.retrieveSets = function(_params) {
		APP.log("debug", "FLICKR.retrieveSets");

		var isStale = UTIL.isStale(ApiBase + "photosets.getList&user_id=" + Ti.App.Properties.getString("FLICKR_NSID"), _params.cache);

		if(isStale) {
			if(_params.cache !== 0 && isStale !== "new") {
				_params.callback();
			}

			HTTP.request({
				timeout: 10000,
				type: "GET",
				format: "JSON",
				url: ApiBase + "photosets.getList&user_id=" + Ti.App.Properties.getString("FLICKR_NSID"),
				passthrough: _params.callback,
				success: this.handleSets,
				failure: _params.error
			});
		} else {
			_params.callback();
		}
	};

	/**
	 * Handles the photo sets data return
	 * @param {Object} _data The returned data
	 * @param {String} _url The URL of the remote source
	 * @param {Function} _callback The function to run on data retrieval
	 */
	this.handleSets = function(_data, _url, _callback) {
		APP.log("debug", "FLICKR.handleSets");

		if(_data.photosets.photoset.length > 0) {
			var db = Ti.Database.open("ChariTi");

			db.execute("DELETE FROM flickr_sets_" + TID + ";");
			db.execute("DELETE FROM flickr_photos_" + TID + ";");
			db.execute("BEGIN TRANSACTION;");

			for(var i = 0, x = _data.photosets.photoset.length; i < x; i++) {
				var set = _data.photosets.photoset[i];

				var id = UTIL.escapeString(set.id);
				var title = UTIL.cleanEscapeString(set.title["_content"]);
				var date_create = UTIL.escapeString(set.date_create);
				var date_update = UTIL.escapeString(set.date_update);
				var description = UTIL.cleanEscapeString(set.description["_content"]);
				var photo_count = UTIL.escapeString(set.photos);

				db.execute("INSERT OR REPLACE INTO flickr_sets_" + TID + " (id, title, date_create, date_update, description, photo_count) VALUES (" + id + ", " + title + ", " + date_create + ", " + date_update + ", " + description + ", " + photo_count + ");");
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
	 * Fetches the remote photo set data
	 * @param {Object} _params The request paramaters to send
	 * @param {String} _params.id The ID of the photoset to retrieve
	 * @param {Function} _params.callback The function to run on data retrieval
	 * @param {Function} _params.error The function to run on error
	 * @param {Number} _params.cache The length of time to consider cached data 'warm'
	 */
	this.retrieveSet = function(_params) {
		APP.log("debug", "FLICKR.retrieveSet");

		if(UTIL.isStale(ApiBase + "photosets.getPhotos&extras=url_sq,url_m&privacy_filter=1&media=photos&photoset_id=" + _params.id), _params.cache) {
			HTTP.request({
				timeout: 10000,
				type: "GET",
				format: "JSON",
				url: ApiBase + "photosets.getPhotos&extras=url_sq,url_m&privacy_filter=1&media=photos&photoset_id=" + _params.id,
				passthrough: _params.callback,
				success: this.handleSet,
				failure: _params.error
			});
		} else {
			_params.callback();
		}
	};

	/**
	 * Handles the photo set data return
	 * @param {Object} _data The returned data
	 * @param {String} _url The URL of the remote source
	 * @param {Function} _callback The function to run on data retrieval
	 */
	this.handleSet = function(_data, _url, _callback) {
		APP.log("debug", "FLICKR.handleSet");

		if(_data.photoset.photo.length > 0) {
			var db = Ti.Database.open("ChariTi");

			db.execute("BEGIN TRANSACTION;");

			for(var i = 0, x = _data.photoset.photo.length; i < x; i++) {
				var photo = _data.photoset.photo[i];
				var set_id = _url.match(/photoset_id=(\d*)/i);

				var id = UTIL.escapeString(photo.id);
				set_id = UTIL.escapeString(set_id[1]);
				var index = i;
				var title = UTIL.escapeString(photo.title);
				var url_m = UTIL.escapeString(photo.url_m);
				var url_sq = UTIL.escapeString(photo.url_sq);

				db.execute("INSERT OR REPLACE INTO flickr_photos_" + TID + " (id, set_id, indx, title, url_m, url_sq) VALUES (" + id + ", " + set_id + ", " + index + ", " + title + ", " + url_m + ", " + url_sq + ");");
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
	 * Retrieves all photo sets
	 */
	this.getSets = function() {
		APP.log("debug", "FLICKR.getSets");

		var db = Ti.Database.open("ChariTi");
		var data = db.execute("SELECT id, title, photo_count FROM flickr_sets_" + TID + " ORDER BY date_update DESC;");
		var temp = [];

		while(data.isValidRow()) {
			temp.push({
				id: data.fieldByName("id"),
				title: data.fieldByName("title"),
				photo_count: data.fieldByName("photo_count")
			});

			data.next();
		}

		data.close();
		db.close();

		return temp;
	};

	/**
	 * Retrieves a photo set by ID
	 * @param {Number} _id The photo set ID
	 */
	this.getSet = function(_id) {
		APP.log("debug", "FLICKR.getSet");

		var db = Ti.Database.open("ChariTi");
		var data = db.execute("SELECT * FROM flickr_photos_" + TID + " WHERE set_id = " + UTIL.cleanEscapeString(_id) + ";");
		var temp = [];

		while(data.isValidRow()) {
			temp.push({
				id: data.fieldByName("id"),
				set_id: data.fieldByName("set_id"),
				index: data.fieldByName("indx"),
				url_sq: data.fieldByName("url_sq")
			});

			data.next();
		}

		data.close();
		db.close();

		return temp;
	};

	/**
	 * Retrieves a photo
	 * @param {Number} _id The photo ID (optional, but must then pass `_index` and `_setid`)
	 * @param {Number} _index The photo index (optional, but must then pass `_id`)
	 * @param {Number} _setid The photo's parent photo set ID (optional, only if using `_index`)
	 */
	this.getPhoto = function(_id, _index, _setid) {
		APP.log("debug", "FLICKR.getPhoto");

		var db = Ti.Database.open("ChariTi");
		var data = null;
		var temp = null;

		if(_id) {
			data = db.execute("SELECT * FROM flickr_photos_" + TID + " WHERE id = " + UTIL.cleanEscapeString(_id) + " LIMIT 1;");
		} else if(_index) {
			data = db.execute("SELECT * FROM flickr_photos_" + TID + " WHERE indx = " + UTIL.cleanEscapeString(_index) + " AND set_id = " + UTIL.cleanEscapeString(_setid) + " LIMIT 1;");
		}

		while(data.isValidRow()) {
			if(_id) {
				temp = {
					id: data.fieldByName("id"),
					set_id: data.fieldByName("set_id"),
					index: data.fieldByName("indx"),
					title: data.fieldByName("title"),
					url_m: data.fieldByName("url_m"),
					url_sq: data.fieldByName("url_sq")
				};
			} else if(_index) {
				temp = {
					id: data.fieldByName("id")
				};
			}

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
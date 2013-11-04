/**
 * Event model
 * 
 * @class Models.event
 * @uses core
 * @uses http
 * @uses utilities
 */
var APP = require("core");
var HTTP = require("http");
var UTIL = require("utilities");

function Model() {
	var TID;

	/**
	 * Initializes the model
	 * @param {Number} _id The UID of the component
	 */
	this.init = function(_id) {
		APP.log("debug", "EVENT.init(" + _id + ")");

		TID = _id;

		var db = Ti.Database.open("ChariTi");

		db.execute("CREATE TABLE IF NOT EXISTS event_" + TID + " (id TEXT PRIMARY KEY, title TEXT, date_start TEXT, date_end TEXT, location TEXT, description TEXT);");

		db.close();
	};

	/**
	 * Fetches the remote data
	 * @param {Object} _params The request paramaters to send
	 * @param {String} _params.url The URL to retrieve data from
	 * @param {Function} _params.callback The function to run on data retrieval
	 * @param {Function} _params.error The function to run on error
	 * @param {Number} _params.cache The length of time to consider cached data 'warm'
	 */
	this.fetch = function(_params) {
		APP.log("debug", "EVENT.fetch");
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

	/**
	 * Handles the data return
	 * @param {Object} _data The returned data
	 * @param {String} _url The URL of the remote source
	 * @param {Function} _callback The function to run on data retrieval
	 */
	this.handleData = function(_data, _url, _callback) {
		APP.log("debug", "EVENT.handleData");

		if(_data.data.length > 0) {
			var db = Ti.Database.open("ChariTi");

			db.execute("DELETE FROM event_" + TID + ";");
			db.execute("BEGIN TRANSACTION;");

			for(var i = 0, x = _data.data.length; i < x; i++) {
				var event = _data.data[i];
				var date_start = "";
				var date_end = "";

				if(event.start_time) {
					date_start = event.start_time.split("T")[0].replace(/-/g, "/") + " " + event.start_time.split("T")[1].split("-")[0];
					date_start = new Date(date_start).getTime();
				}

				if(event.end_time) {
					date_end = event.end_time.split("T")[0].replace(/-/g, "/") + " " + event.end_time.split("T")[1].split("-")[0];
					date_end = new Date(date_end).getTime();
				}

				var id = UTIL.escapeString(event.id);
				var title = UTIL.cleanEscapeString(event.name);
				date_start = UTIL.escapeString(date_start);
				date_end = UTIL.escapeString(date_end);
				var location = UTIL.cleanEscapeString(event.location);
				var description = UTIL.cleanEscapeString(event.description);

				db.execute("INSERT OR REPLACE INTO event_" + TID + " (id, title, date_start, date_end, location, description) VALUES (" + id + ", " + title + ", " + date_start + ", " + date_end + ", " + location + ", " + description + ");");
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
	 * Retrieves all events
	 */
	this.getAllEvents = function() {
		APP.log("debug", "EVENT.getAllEvents");

		var db = Ti.Database.open("ChariTi");
		var data = db.execute("SELECT id, title, date_start FROM event_" + TID + " ORDER BY date_start ASC;");
		var temp = [];

		while(data.isValidRow()) {
			temp.push({
				id: data.fieldByName("id"),
				title: data.fieldByName("title"),
				date_start: data.fieldByName("date_start")
			});

			data.next();
		}

		data.close();
		db.close();

		return temp;
	};

	/**
	 * Retrieves an event by ID
	 * @param {Number} _id The event ID
	 */
	this.getEvent = function(_id) {
		APP.log("debug", "EVENT.getEvent");

		var db = Ti.Database.open("ChariTi");
		var data = db.execute("SELECT * FROM event_" + TID + " WHERE id = " + UTIL.cleanEscapeString(_id) + ";");
		var temp;

		while(data.isValidRow()) {
			temp = {
				id: data.fieldByName("id"),
				title: data.fieldByName("title"),
				date_start: data.fieldByName("date_start"),
				date_end: data.fieldByName("date_end"),
				location: data.fieldByName("location"),
				description: data.fieldByName("description")
			};

			data.next();
		}

		data.close();
		db.close();

		return temp;
	};

	/**
	 * Retrieves the next event
	 * @param {Number} _id The current event date
	 */
	this.getNextEvent = function(_date) {
		APP.log("debug", "EVENT.getNextEvent");

		var db = Ti.Database.open("ChariTi");
		var data = db.execute("SELECT id FROM event_" + TID + " WHERE date_start > " + UTIL.cleanEscapeString(_date) + " ORDER BY date_start ASC LIMIT 1;");

		if(data.rowCount == 0) {
			data = db.execute("SELECT id FROM event_" + TID + " ORDER BY date_start ASC LIMIT 1;");
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

	/**
	 * Retrieves the previous event
	 * @param {Number} _id The current event date
	 */
	this.getPreviousEvent = function(_date) {
		APP.log("debug", "EVENT.getPreviousEvent");

		var db = Ti.Database.open("ChariTi");
		var data = db.execute("SELECT id FROM event_" + TID + " WHERE date_start < " + UTIL.cleanEscapeString(_date) + " ORDER BY date_start DESC LIMIT 1;");

		if(data.rowCount == 0) {
			data = db.execute("SELECT id FROM event_" + TID + " ORDER BY date_start DESC LIMIT 1;");
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
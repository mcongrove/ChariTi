/**
 * Controller for the Flickr album list screen
 * 
 * @class Controllers.flickr
 * @uses Models.flickr
 * @uses core
 * @uses utilities
 */
var APP = require("core");
var UTIL = require("utilities");
var MODEL = require("models/flickr")();

var CONFIG = arguments[0];
var SELECTED;

$.init = function() {
	APP.log("debug", "flickr.init | " + JSON.stringify(CONFIG));

	APP.openLoading();

	MODEL.init(CONFIG.index);
	MODEL.setApiKey(CONFIG.apiKey);

	$.retrieveData();

	$.NavigationBar.setBackgroundColor(APP.Settings.colors.primary || "#000");

	if(CONFIG.isChild === true) {
		$.NavigationBar.showBack();
	}

	if(APP.Settings.useSlideMenu) {
		$.NavigationBar.showMenu();
	} else {
		$.NavigationBar.showSettings();
	}
};

$.retrieveData = function(_force, _callback) {
	MODEL.generateNsid({
		username: CONFIG.username,
		callback: function() {
			$.handleNsid();

			if(typeof _callback !== "undefined") {
				_callback();
			}
		},
		error: function() {
			alert("Unable to connect. Please try again later.");

			APP.closeLoading();

			if(typeof _callback !== "undefined") {
				_callback();
			}
		}
	});
};

$.handleNsid = function() {
	APP.log("debug", "flickr.handleNsid");

	MODEL.retrieveSets({
		cache: CONFIG.cache,
		callback: $.handleSets,
		error: function() {
			alert("Unable to connect. Please try again later.");

			APP.closeLoading();
		}
	});
};

$.handleSets = function() {
	APP.log("debug", "flickr.handleSets");

	var data = MODEL.getSets();
	var rows = [];

	for(var i = 0, x = data.length; i < x; i++) {
		var row = Alloy.createController("flickr_row", {
			id: data[i].id,
			heading: data[i].title,
			subHeading: data[i].photo_count + " Photos"
		}).getView();

		rows.push(row);
	}

	$.container.setData(rows);

	APP.closeLoading();

	if(APP.Device.isTablet && !SELECTED) {
		SELECTED = data[0].id;

		APP.addChild("flickr_album", {
			id: data[0].id,
			cache: CONFIG.cache,
			index: CONFIG.index,
			apiKey: CONFIG.apiKey
		});
	}
};

// Event listeners
$.container.addEventListener("click", function(_event) {
	APP.log("debug", "flickr @click " + _event.row.id);

	if(APP.Device.isTablet) {
		if(_event.row.id == SELECTED) {
			return;
		} else {
			SELECTED = _event.row.id;
		}
	}

	APP.addChild("flickr_album", {
		id: _event.row.id,
		cache: CONFIG.cache,
		index: CONFIG.index,
		apiKey: CONFIG.apiKey
	});
});

// Pull to Refresh
function ptrRelease(_event) {
	$.retrieveData(true, function() {
		_event.hide();
	});
}

// Kick off the init
$.init();
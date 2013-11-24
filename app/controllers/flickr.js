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

/**
 * Initializes the controller
 */
$.init = function() {
	APP.log("debug", "flickr.init | " + JSON.stringify(CONFIG));

	APP.openLoading();

	MODEL.init(CONFIG.index);
	MODEL.setApiKey(CONFIG.apiKey);

	$.retrieveData();

	$.NavigationBar.setBackgroundColor(APP.Settings.colors.primary);

	if(CONFIG.isChild === true) {
		$.NavigationBar.showBack(function(_event) {
			APP.removeChild();
		});
	}

	if(APP.Settings.useSlideMenu) {
		$.NavigationBar.showMenu(function(_event) {
			APP.toggleMenu();
		});
	} else {
		$.NavigationBar.showSettings(function(_event) {
			APP.openSettings();
		});
	}
};

/**
 * Retrieves the NSID data
 * @param {Object} _force Whether to force the request or not (ignores cached data)
 * @param {Object} _callback The function to run on data retrieval
 */
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
			APP.closeLoading();

			Alloy.createWidget("com.mcongrove.toast", null, {
				text: "Unable to connect; try again later",
				duration: 2000,
				view: APP.GlobalWrapper
			});

			if(typeof _callback !== "undefined") {
				_callback();
			}
		}
	});
};

/**
 * Handles the NSID data return
 */
$.handleNsid = function() {
	APP.log("debug", "flickr.handleNsid");

	MODEL.retrieveSets({
		cache: CONFIG.cache,
		callback: $.handleSets,
		error: function() {
			Alloy.createWidget("com.mcongrove.toast", null, {
				text: "Unable to connect; try again later",
				duration: 2000
			});

			APP.closeLoading();
		}
	});
};

/*
 * Handles the photo set data return
 */
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

/**
 * Handles the pull-to-refresh event
 * @param {Object} _event The event
 */
function ptrRelease(_event) {
	$.retrieveData(true, function() {
		_event.hide();
	});
}

// Kick off the init
$.init();
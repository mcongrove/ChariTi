/**
 * Controller for the Flickr photo screen
 * 
 * @class Controllers.flickr.photo
 * @uses Models.flickr
 * @uses core
 */
var APP = require("core");
var MODEL = require("models/flickr")();

var CONFIG = arguments[0] || {};
var PREVIOUS = null;
var NEXT = null;

var metaVisible = true;

$.NavigationBar.setBackgroundColor(APP.Settings.colors.primary || "#000");
$.NavigationBar.showBack({
	callback: function(_event) {
		APP.removeChild();
		APP.SlideMenuEngaged = true;
	}
});

APP.SlideMenuEngaged = false;

/**
 * Initializes the controller
 */
$.init = function() {
	APP.log("debug", "flickr_photo.init | " + JSON.stringify(CONFIG));

	MODEL.init(CONFIG.index);
	MODEL.setApiKey(CONFIG.apiKey);

	$.handleData(MODEL.getPhoto(CONFIG.id));
};

/**
 * Handles the data return
 * @param {Object} _data The returned data
 */
$.handleData = function(_data) {
	APP.log("debug", "flickr_photo.handleData");

	PREVIOUS = MODEL.getPhoto(null, (parseInt(_data.index, 10) - 1).toString(), CONFIG.setid);
	NEXT = MODEL.getPhoto(null, (parseInt(_data.index, 10) + 1).toString(), CONFIG.setid);

	$.image.image = _data.url_m;
	$.title.text = _data.title ? _data.title : "";

	if(_data.description) {
		$.description.text = _data.description.substring(0, 150);
	} else {
		$.meta.remove($.description);
		$.title.bottom = "15dp";
	}
};

// Event listeners
$.container.addEventListener("singletap", function(_event) {
	if(metaVisible) {
		metaVisible = false;

		$.meta.animate({
			opacity: 0,
			duration: 500
		});
	} else {
		metaVisible = true;

		$.meta.animate({
			opacity: 1,
			duration: 500
		});
	}
});

$.container.addEventListener("swipe", function(_event) {
	if(_event.direction == "right") {
		if(PREVIOUS) {
			APP.log("debug", "flickr_photo @previous");

			CONFIG.id = PREVIOUS.id;
			PREVIOUS = null;
			NEXT = null;

			$.init();
		}
	} else if(_event.direction == "left") {
		if(NEXT) {
			APP.log("debug", "flickr_photo @next");

			CONFIG.id = NEXT.id;
			PREVIOUS = null;
			NEXT = null;

			$.init();
		}
	}
});

// Kick off the init
$.init();
var APP = require("core");
var UTIL = require("utilities");
var DATE = require("alloy/moment");
var STRING = require("alloy/string");
var MODEL = require("models/vimeo")();

var CONFIG = arguments[0];
var SELECTED;

$.init = function() {
	APP.log("debug", "vimeo.init | " + JSON.stringify(CONFIG));

	MODEL.init(CONFIG.index);

	CONFIG.feed = "http://vimeo.com/api/v2/" + CONFIG.username + "/videos.json";

	APP.openLoading();

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
	MODEL.fetch({
		url: CONFIG.feed,
		cache: _force ? 0 : CONFIG.cache,
		callback: function() {
			$.handleVideos();

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

$.handleVideos = function() {
	APP.log("debug", "vimeo.handleVideos");

	var data = MODEL.getVideos();
	var rows = [];

	for(var i = 0, x = data.length; i < x; i++) {
		var row = Alloy.createController("vimeo_row", {
			id: data[i].id,
			url: data[i].link,
			heading: data[i].title,
			subHeading: STRING.ucfirst(DATE(data[i].date, "YYYY/MM/DD HH:mm:ss").fromNow())
		}).getView();

		rows.push(row);
	}

	$.container.setData(rows);

	APP.closeLoading();

	if(APP.Device.isTablet && !SELECTED) {
		SELECTED = data[0].id;

		APP.addChild("vimeo_video", {
			url: data[0].link,
			index: CONFIG.index
		});
	}
};

// Event listeners
$.container.addEventListener("click", function(_event) {
	APP.log("debug", "vimeo @click " + _event.row.url);

	if(APP.Device.isTablet) {
		if(_event.row.id == SELECTED) {
			return;
		} else {
			SELECTED = _event.row.id;
		}
	}

	APP.addChild("vimeo_video", {
		url: _event.row.url,
		index: CONFIG.index
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
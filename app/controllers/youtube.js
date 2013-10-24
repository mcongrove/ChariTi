/**
 * Controller for the YouTube list screen
 * 
 * @class Controllers.youtube
 * @uses Models.youtube
 * @uses core
 * @uses utilities
 */
var APP = require("core");
var UTIL = require("utilities");
var DATE = require("alloy/moment");
var STRING = require("alloy/string");
var MODEL = require("models/youtube")();

var CONFIG = arguments[0];
var SELECTED;

$.init = function() {
	APP.log("debug", "youtube.init | " + JSON.stringify(CONFIG));

	MODEL.init(CONFIG.index);

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

$.retrieveData = function() {
	MODEL.setUsername({
		username: CONFIG.username,
		callback: $.handleUsername
	});
};

$.handleUsername = function() {
	APP.log("debug", "youtube.handleUsername");

	MODEL.fetch({
		cache: CONFIG.cache,
		callback: $.handleVideos,
		error: function() {
			alert("Unable to connect. Please try again later.");

			APP.closeLoading();
		}
	});
};

$.handleVideos = function() {
	APP.log("debug", "youtube.handleVideos");

	var data = MODEL.getVideos();
	var rows = [];

	for(var i = 0, x = data.length; i < x; i++) {
		var time = DATE(data[i].date, "YYYY/MM/DD HH:mm:ss");
		time = time.isBefore() ? time : DATE();

		var row = Alloy.createController("youtube_row", {
			id: data[i].id,
			url: data[i].link,
			heading: data[i].title,
			subHeading: STRING.ucfirst(time.fromNow())
		}).getView();

		rows.push(row);
	}

	$.container.setData(rows);

	APP.closeLoading();

	if(APP.Device.isTablet && !SELECTED) {
		SELECTED = data[0].id;

		APP.addChild("youtube_video", {
			url: data[0].link,
			title: data[0].title,
			index: CONFIG.index
		});
	}
};

// Event listeners
$.container.addEventListener("click", function(_event) {
	APP.log("debug", "youtube @click " + _event.row.url);

	if(APP.Device.isTablet) {
		if(_event.row.id == SELECTED) {
			return;
		} else {
			SELECTED = _event.row.id;
		}
	}

	if(OS_IOS) {
		APP.addChild("youtube_video", {
			url: _event.row.url,
			title: _event.row.setTitle,
			index: CONFIG.index
		});
	} else if(OS_ANDROID) {
		if(APP.Device.isTablet) {
			APP.addChild("youtube_video", {
				url: _event.row.url,
				title: _event.row.setTitle,
				index: CONFIG.index
			});
		}

		Ti.Platform.openURL(_event.row.url);
	}
});

// Pull to Refresh
function ptrRelease(_event) {
	$.retrieveData(true, function() {
		_event.hide();
	});
}

// Kick off the init
$.init();
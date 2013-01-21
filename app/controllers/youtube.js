var APP = require("core");
var UTIL = require("utilities");
var MODEL = require("models/youtube");

var CONFIG = arguments[0];
var SELECTED;

$.init = function() {
	APP.log("debug", "youtube.init | " + JSON.stringify(CONFIG));
	
	APP.openLoading();
	
	$.NavigationBar.Wrapper.backgroundColor = APP.Settings.colors.primary || "#000";
	$.NavigationBar.right.visible			= true;
	$.NavigationBar.rightImage.image		= "/images/settings.png";

	if(CONFIG.isChild === true) {
		$.NavigationBar.back.visible		= true;
	}
	
	MODEL.setUsername({
		username: CONFIG.username,
		callback: $.handleUsername
	});
};

$.handleUsername = function() {
	APP.log("debug", "youtube.handleUsername");
	
	MODEL.fetch({
		cache: CONFIG.cache,
		callback: $.handleVideos
	});
};

$.handleVideos = function() {
	APP.log("debug", "youtube.handleVideos");
	
	var data = MODEL.getVideos();
	var rows = [];
	
	for(var i = 0, x = data.length; i < x; i++) {
		var row = Alloy.createController("youtube_row", {
			id: data[i].id,
			url: data[i].link,
			heading: data[i].title,
			subHeading: UTIL.toDateRelative(new Date(data[i].date).getTime())
		}).getView();
		
		rows.push(row);
	}
	
	$.content.setData(rows);
	
	APP.closeLoading();
	
	if(APP.Device.isTablet) {
		SELECTED = data[0].id;
		
		APP.addChild("youtube_video", { url: data[0].link, title: data[0].title });
	}
};

// Event listeners
$.NavigationBar.back.addEventListener("click", function(_event) {
	APP.log("debug", "youtube @close");
	
	APP.removeChild();
});

$.NavigationBar.right.addEventListener("click", function(_event) {
	APP.openSettings();
});

$.content.addEventListener("click", function(_event) {
	APP.log("debug", "youtube @click " + _event.row.url);
	
	if(APP.Device.isTablet) {
		if(_event.row.id == SELECTED) {
			return;
		} else {
			SELECTED = _event.row.id;
		}
	}
	
	APP.addChild("youtube_video", {
		url: _event.row.url,
		title: _event.row.setTitle
	});
});

// Kick off the init
$.init();
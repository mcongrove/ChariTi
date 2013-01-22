var APP = require("core");
var UTIL = require("utilities");
var MODEL = require("models/youtube");

var CONFIG = arguments[0];

$.init = function() {
	APP.log("debug", "youtube.init | " + JSON.stringify(CONFIG));
	
	APP.openLoading();
	
	$.NavigationBar.Wrapper.backgroundColor = APP.Settings.colors.primary || "#000";
	$.NavigationBar.right.visible			= true;
	$.NavigationBar.rightImage.image		= "/images/settings.png";

	if(CONFIG.isChild === true) {
		$.NavigationBar.back.visible		= true;
	}

};

$.handleUsername = function() {
	APP.log("debug", "youtube.handleUsername");
	
	MODEL.fetch({
		cache: CONFIG.cache,
		callback: $.handleVideos
	});
};

$.handleVideos = function(_data) {
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
};

// Event listeners
$.Wrapper.addEventListener("APP:screenAdded", function() {
	MODEL.setUsername({
		username: CONFIG.username,
		callback: $.handleUsername
	});
});

$.NavigationBar.back.addEventListener("click", function(_event) {
	APP.log("debug", "youtube @close");
	
	APP.removeChild();
});

$.NavigationBar.right.addEventListener("click", function(_event) {
	APP.openSettings();
});

$.content.addEventListener("click", function(_event) {
	APP.log("debug", "youtube @click " + _event.row.url);
	
	APP.addChild("youtube_video", {
		url: _event.row.url,
		title: _event.row.setTitle
	});
});

// Kick off the init
$.init();
var APP = require("core");
var MODEL = require("models/flickr");

var DATA = arguments[0] || {};

$.init = function() {
	Ti.API.debug("flickr_photo.init");
	Ti.API.trace(JSON.stringify(DATA));
	
	$.handleData(MODEL.getPhoto(DATA.id));
};

$.handleData = function(_data) {
	Ti.API.debug("flickr.handleData");
	
	$.NavigationBar.Wrapper.backgroundColor	= APP.Settings.colors.primary || "#000";
	$.NavigationBar.title.text				= _data.title;
	$.NavigationBar.title.color				= APP.Settings.colors.text || "#FFF";
	$.NavigationBar.back.visible			= true;
	
	$.image.image = _data.url_m;
};

// Event listeners
$.NavigationBar.back.addEventListener("click", function(_event) {
	Ti.API.debug("flickr @close");
	
	APP.closeDetailScreen();
});

// Kick off the init
$.init();
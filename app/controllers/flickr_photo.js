var APP = require("core");
var MODEL = require("models/flickr");

var DATA = arguments[0] || {};

$.init = function() {
	$.handleData(MODEL.getPhoto(DATA.id));
};

$.handleData = function(_data) {
	$.NavigationBar.title.text				= _data.title;
	$.NavigationBar.title.color				= APP.Settings.colors.text || "#FFF";
	$.NavigationBar.Wrapper.backgroundColor	= APP.Settings.colors.primary || "#000";
	
	$.image.image = _data.url_m;
};

// Event listeners
$.NavigationBar.back.addEventListener("click", function(_event) {
	APP.closeDetailScreen();
});

// Kick off the init
$.init();
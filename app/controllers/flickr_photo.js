var APP = require("core");
var MODEL = require("models/flickr");

var DATA = arguments[0] || {};

var metaVisible = false;

$.init = function() {
	Ti.API.debug("flickr_photo.init");
	Ti.API.trace(JSON.stringify(DATA));
	
	$.handleData(MODEL.getPhoto(DATA.id));
};

$.handleData = function(_data) {
	Ti.API.debug("flickr.handleData");
	
	$.NavigationBar.Wrapper.backgroundColor	= APP.Settings.colors.primary || "#000";
	$.NavigationBar.back.visible			= true;
	
	$.image.image		= _data.url_m;
	$.title.text		= _data.title ? _data.title : "";
	$.description.text	= _data.description ? _data.description.substring(0, 150) : "";
	$.meta.visible		= false;
};

// Event listeners
$.content.addEventListener("click", function(_event) {
	if(metaVisible) {
		metaVisible		= false;
		$.meta.visible	= false;
	} else {
		metaVisible		= true;
		$.meta.visible	= true;
	}
});

$.NavigationBar.back.addEventListener("click", function(_event) {
	Ti.API.debug("flickr @close");
	
	APP.closeDetailScreen();
});

// Kick off the init
$.init();
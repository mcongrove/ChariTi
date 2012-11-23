var APP = require("core");
var MODEL = require("models/flickr");

var DATA		= arguments[0] || {};
var PREVIOUS	= null;
var NEXT		= null;

var metaVisible = false;

$.init = function() {
	Ti.API.debug("flickr_photo.init");
	Ti.API.trace(JSON.stringify(DATA));
	
	$.handleData(MODEL.getPhoto(DATA.id));
};

$.handleData = function(_data) {
	Ti.API.debug("flickr.handleData");
	
	PREVIOUS	= MODEL.getPhoto(null, (parseInt(_data.index, 10) - 1).toString());
	NEXT		= MODEL.getPhoto(null, (parseInt(_data.index, 10) + 1).toString());
	
	$.NavigationBar.Wrapper.backgroundColor	= APP.Settings.colors.primary || "#000";
	$.NavigationBar.back.visible			= true;
	
	$.image.image		= _data.url_m;
	$.title.text		= _data.title ? _data.title : "";
	$.description.text	= _data.description ? _data.description.substring(0, 150) : "";
	$.meta.visible		= false;
};

// Event listeners
$.content.addEventListener("singletap", function(_event) {
	if(metaVisible) {
		metaVisible		= false;
		$.meta.visible	= false;
	} else {
		metaVisible		= true;
		$.meta.visible	= true;
	}
});

$.content.addEventListener("swipe", function(_event) {
	if(_event.direction == "right") {
		if(PREVIOUS) {
			Ti.API.debug("flickr @previous");
			
			DATA.id			= PREVIOUS.id;
			PREVIOUS		= null;
			NEXT			= null;
			metaVisible		= false;
			$.meta.visible	= false;
			
			$.init();
		}
	} else if(_event.direction == "left") {
		if(NEXT) {
			Ti.API.debug("flickr @next");
			
			DATA.id			= NEXT.id;
			PREVIOUS		= null;
			NEXT			= null;
			metaVisible		= false;
			$.meta.visible	= false;
			
			$.init();
		}
	}
});

$.NavigationBar.back.addEventListener("click", function(_event) {
	Ti.API.debug("flickr @close");
	
	APP.closeDetailScreen();
});

// Kick off the init
$.init();
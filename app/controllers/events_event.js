var APP = require("core");
var UTIL = require("utilities");
var SOCIAL = require("social");
var MODEL = require("models/events");

var DATA = arguments[0] || {};
var ACTION = {};

$.init = function() {
	APP.log("debug", "events.init | " + JSON.stringify(DATA));
	
	$.handleData(MODEL.getEvent(DATA.id));
};

$.handleData = function(_data) {
	APP.log("debug", "events.handleData");
	
	$.heading.text	= _data.title;
	$.text.value	= _data.description;
	$.location.text	= "@ " + _data.location;
	$.date.text		= UTIL.toDateAbsolute(_data.date_start);
	$.date.color	= APP.Settings.colors.primary;
	
	ACTION.url		= "http://www.facebook.com/events/" + _data.id;
	
	$.NavigationBar.Wrapper.backgroundColor	= APP.Settings.colors.primary || "#000";
	$.NavigationBar.back.visible			= true;
	$.NavigationBar.right.visible			= true;
	$.NavigationBar.rightImage.image		= "/images/action.png";
};

// Event listeners
$.NavigationBar.back.addEventListener("click", function(_event) {
	APP.log("debug", "events @close");
	
	APP.closeDetailScreen();
});

$.NavigationBar.right.addEventListener("click", function(_event) {
	APP.log("debug", "events @menu");
	
	SOCIAL.share(ACTION.url);
});

// Kick off the init
$.init();
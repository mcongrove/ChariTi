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
	
	var options = [];
	var mapping = [];
	
	if(SOCIAL.facebookSupported) { options.push("Share via Facebook"); mapping.push("facebook"); }
	if(SOCIAL.twitterSupported) { options.push("Share via Twitter"); mapping.push("twitter"); }
	if(SOCIAL.emailSupported) { options.push("Share via E-Mail"); mapping.push("email"); }
	options.push("Open in Safari"); mapping.push("safari");
	options.push("Cancel"); mapping.push("cancel");
	
	var dialog = Ti.UI.createOptionDialog({
		options: options,
		cancel: options.length - 1,
		selectedIndex: options.length - 1
	});
	
	dialog.addEventListener("click", function(_event) {
		switch(mapping[_event.index]) {
			case "facebook":
				APP.log("trace", "events @menu_facebook")
				SOCIAL.facebook(ACTION.url);
				break;
			case "twitter":
				APP.log("trace", "events @menu_twitter")
				SOCIAL.twitter(ACTION.url);
				break;
			case "email":
				APP.log("trace", "events @menu_email")
				SOCIAL.email(ACTION.url);
				break;
			case "safari":
				APP.log("trace", "events @menu_safari")
				Ti.Platform.openURL(ACTION.url);
				break;
			case "safari":
				APP.log("trace", "events @menu_cancel")
				break;
		}
	});
	
	dialog.show();
});

// Kick off the init
$.init();
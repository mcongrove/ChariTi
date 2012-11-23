var APP = require("core");
var UTIL = require("utilities");
var SOCIAL = require("social");
var MODEL = require("models/facebook");

var DATA = arguments[0] || {};
var ACTION = {};

$.init = function() {
	Ti.API.debug("facebook_article.init");
	Ti.API.trace(JSON.stringify(DATA));
	
	$.handleData(MODEL.getArticle(DATA.id));
};

$.handleData = function(_data) {
	Ti.API.debug("facebook_article.handleData");
	
	$.heading.text	= _data.title;
	$.text.value	= _data.description;
	$.date.text		= UTIL.toDateRelative(_data.date);
	$.date.color	= APP.Settings.colors.primary;
	
	ACTION.url		= _data.link
	
	$.NavigationBar.Wrapper.backgroundColor	= APP.Settings.colors.primary || "#000";
	$.NavigationBar.back.visible			= true;
	$.NavigationBar.custom.visible			= true;
	$.NavigationBar.customImage.image		= "/images/action.png";
};

// Event listeners
$.NavigationBar.back.addEventListener("click", function(_event) {
	Ti.API.debug("facebook_article @close");
	
	APP.closeDetailScreen();
});

$.NavigationBar.custom.addEventListener("click", function(_event) {
	Ti.API.debug("facebook_article @menu");
	
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
				Ti.API.trace("facebook_article @menu_facebook")
				SOCIAL.facebook(ACTION.url);
				break;
			case "twitter":
				Ti.API.trace("facebook_article @menu_twitter")
				SOCIAL.twitter(ACTION.url);
				break;
			case "email":
				Ti.API.trace("facebook_article @menu_email")
				SOCIAL.email(ACTION.url);
				break;
			case "safari":
				Ti.API.trace("facebook_article @menu_safari")
				Ti.Platform.openURL(ACTION.url);
				break;
			case "safari":
				Ti.API.trace("facebook_article @menu_cancel")
				break;
		}
	});
	
	dialog.show();
});

// Kick off the init
$.init();
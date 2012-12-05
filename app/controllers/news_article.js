var APP = require("core");
var UTIL = require("utilities");
var SOCIAL = require("social");
var MODEL = require("models/news");

var DATA = arguments[0] || {};
var ACTION = {};

$.init = function() {
	APP.log("debug", "news_article.init | " + JSON.stringify(DATA));
	
	$.handleData(MODEL.getArticle(DATA.id));
};

$.handleData = function(_data) {
	APP.log("debug", "news_article.handleData");
	
	$.heading.text	= _data.title;
	$.text.value	= _data.description;
	$.date.text		= UTIL.toDateRelative(_data.date);
	$.date.color	= APP.Settings.colors.primary;
	
	ACTION.url		= _data.link
	
	$.NavigationBar.Wrapper.backgroundColor	= APP.Settings.colors.primary || "#000";
	$.NavigationBar.back.visible			= true;
	$.NavigationBar.right.visible			= true;
	$.NavigationBar.rightImage.image		= "/images/action.png";
};

// Event listeners
$.NavigationBar.back.addEventListener("click", function(_event) {
	APP.log("debug", "news_article @close");
	
	APP.closeDetailScreen();
});

$.NavigationBar.right.addEventListener("click", function(_event) {
	APP.log("debug", "news_article @menu");
	
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
				APP.log("trace", "news_article @menu_facebook")
				SOCIAL.facebook(ACTION.url);
				break;
			case "twitter":
				APP.log("trace", "news_article @menu_twitter")
				SOCIAL.twitter(ACTION.url);
				break;
			case "email":
				APP.log("trace", "news_article @menu_email")
				SOCIAL.email(ACTION.url);
				break;
			case "safari":
				APP.log("trace", "news_article @menu_safari")
				Ti.Platform.openURL(ACTION.url);
				break;
			case "safari":
				APP.log("trace", "news_article @menu_cancel")
				break;
		}
	});
	
	dialog.show();
});

// Kick off the init
$.init();
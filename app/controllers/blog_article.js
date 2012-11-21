var APP = require("core");
var UTIL = require("utilities");
var SOCIAL = require("social");
var MODEL = require("models/blog");

var DATA = arguments[0] || {};
var ACTION = {};

$.init = function() {
	Ti.API.debug("blog_article.init");
	Ti.API.trace(JSON.stringify(DATA));
	
	$.handleData(MODEL.getArticle(DATA.id));
};

$.handleData = function(_data) {
	Ti.API.debug("blog_article.handleData");
	
	$.heading.text	= _data.title;
	$.text.text		= _data.description;
	$.date.text		= UTIL.toDateRelative(_data.date);
	$.date.color	= APP.Settings.colors.primary;
	
	ACTION.url		= _data.link;
	
	$.NavigationBar.Wrapper.backgroundColor	= APP.Settings.colors.primary || "#000";
	$.NavigationBar.back.visible			= true;
	$.NavigationBar.custom.visible			= true;
	$.NavigationBar.customImage.image		= "/images/action.png";
};

// Event listeners
$.NavigationBar.back.addEventListener("click", function(_event) {
	Ti.API.debug("blog_article @close");
	
	APP.closeDetailScreen();
});

$.NavigationBar.custom.addEventListener("click", function(_event) {
	Ti.API.debug("blog_article @menu");
	
	var dialog = Ti.UI.createOptionDialog({
		options: [
			"Share via E-Mail",
			"Open in Safari",
			"Cancel"
		],
		cancel: 2,
		selectedIndex: 2
	});
	
	dialog.addEventListener("click", function(_event) {
		switch(_event.index) {
			case 0:
				Ti.API.trace("blog_article @menu_email")
				SOCIAL.email("<a href='" + ACTION.url + "'>" + ACTION.url + "</a>");
				break;
			case 1:
				Ti.API.trace("blog_article @menu_safari")
				Ti.Platform.openURL(ACTION.url);
				break;
			case 2:
				Ti.API.trace("blog_article @menu_cancel")
				break;
		}
	});
	
	dialog.show();
});

// Kick off the init
$.init();
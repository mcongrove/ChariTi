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
	
	SOCIAL.share(ACTION.url);
});

// Kick off the init
$.init();
var APP = require("core");
var UTIL = require("utilities");
var SOCIAL = require("social");
var MODEL = require("models/news");

var DATA = arguments[0] || {};
var ACTION = {};

$.init = function() {
	APP.log("debug", "news_article.init | " + JSON.stringify(DATA));
	
	$.handleData(MODEL.getArticle(DATA.id));
	$.handleNavigation();
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

$.handleNavigation = function () {
	ACTION.next		= MODEL.getNextArticle(DATA.id);
	ACTION.previous	= MODEL.getPreviousArticle(DATA.id);
	
	var navigation = Ti.UI.createView({
		width: "96dp",
		height: "37dp",
		top: "5dp",
		backgroundImage: "/images/navigation.png"
	});
	
	var arrowNext = Ti.UI.createImageView({
		image: "/images/arrowDown.png",
		width: "47dp",
		height: "37dp",
		top: "0dp",
		right: "0dp"
	});
	
	var arrowPrevious = Ti.UI.createImageView({
		image: "/images/arrowUp.png",
		width: "47dp",
		height: "37dp",
		top: "0dp",
		left: "0dp"
	});
	
	if(ACTION.next) {
		arrowNext.addEventListener("click", function(_event) {
			APP.log("debug", "news_article @next");
			
			APP.openDetailScreen("news_article", {
				id: ACTION.next.id
			});
		});
	} else {
		arrowNext.opacity = 0.4;
	}
	
	if(ACTION.previous) {
		arrowPrevious.addEventListener("click", function(_event) {
			APP.log("debug", "news_article @previous");
			
			APP.openDetailScreen("news_article", {
				id: ACTION.previous.id
			});
		});
	} else {
		arrowPrevious.opacity = 0.4;
	}
	
	navigation.add(arrowNext);
	navigation.add(arrowPrevious);
	$.NavigationBar.Wrapper.add(navigation);
};

// Event listeners
$.NavigationBar.back.addEventListener("click", function(_event) {
	APP.log("debug", "news_article @close");
	
	APP.closeAllDetailScreens();
});

$.NavigationBar.right.addEventListener("click", function(_event) {
	APP.log("debug", "news_article @menu");
	
	SOCIAL.share(ACTION.url);
});

// Kick off the init
$.init();
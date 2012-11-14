var APP = require("core");

var DATA = arguments[0] || {};

Ti.API.debug("youtube_video");
Ti.API.info(JSON.stringify(DATA));

$.NavigationBar.title.text				= DATA.title || "";
$.NavigationBar.title.color				= APP.Settings.colors.text || "#FFF";
$.NavigationBar.Wrapper.backgroundColor	= APP.Settings.colors.primary || "#000";

$.content.url = DATA.url || "";

// Event listeners
$.NavigationBar.back.addEventListener("click", function(_event) {
	Ti.API.debug("youtube_video @close");
	
	APP.closeDetailScreen();
});
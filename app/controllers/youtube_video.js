var APP = require("core");

var DATA = arguments[0] || {};

Ti.API.debug("youtube_video");
Ti.API.info(JSON.stringify(DATA));

$.NavigationBar.Wrapper.backgroundColor	= APP.Settings.colors.primary || "#000";
$.NavigationBar.title.text				= DATA.title || "";
$.NavigationBar.title.color				= APP.Settings.colors.text || "#FFF";
$.NavigationBar.back.visible			= true;

$.content.url = DATA.url || "";

// Event listeners
$.NavigationBar.back.addEventListener("click", function(_event) {
	Ti.API.debug("youtube_video @close");
	
	APP.closeDetailScreen();
});
var APP = require("core");

var DATA = arguments[0] || {};

APP.log("debug", "youtube_video | " + JSON.stringify(DATA));

$.NavigationBar.Wrapper.backgroundColor	= APP.Settings.colors.primary || "#000";
$.NavigationBar.back.visible			= APP.Device.isHandheld;

$.content.url = DATA.url || "";
$.content.scalesPageToFit = true;
$.content.willHandleTouches = false;

// Event listeners
$.NavigationBar.back.addEventListener("click", function(_event) {
	APP.log("debug", "youtube_video @close");
	
	APP.removeChild();
});
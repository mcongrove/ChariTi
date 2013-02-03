var APP = require("core");

var CONFIG = arguments[0] || {};

APP.log("debug", "youtube_video | " + JSON.stringify(CONFIG));

$.NavigationBar.Wrapper.backgroundColor = APP.Settings.colors.primary || "#000";
$.NavigationBar.back.visible = APP.Device.isHandheld;

$.content.url = CONFIG.url || "";
$.content.scalesPageToFit = true;
$.content.willHandleTouches = false;

// Event listeners
$.NavigationBar.back.addEventListener("click", function(_event) {
	APP.log("debug", "youtube_video @close");

	APP.removeChild();
});
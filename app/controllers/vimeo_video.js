var APP = require("core");

var CONFIG = arguments[0] || {};

APP.log("debug", "vimeo_video | " + JSON.stringify(CONFIG));

$.content.url = CONFIG.url || "";
$.content.scalesPageToFit = true;
$.content.willHandleTouches = false;

$.NavigationBar.setBackgroundColor(APP.Settings.colors.primary || "#000");

if(APP.Device.isHandheld) {
	$.NavigationBar.showBack();
}
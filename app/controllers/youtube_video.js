/**
 * Controller for the YouTube video screen
 * 
 * @class Controllers.youtube.video
 * @uses core
 */
var APP = require("core");

var CONFIG = arguments[0] || {};

APP.log("debug", "youtube_video | " + JSON.stringify(CONFIG));

$.container.url = CONFIG.url || "";
$.container.scalesPageToFit = true;
$.container.willHandleTouches = false;

$.NavigationBar.setBackgroundColor(APP.Settings.colors.primary);

if(APP.Device.isHandheld) {
	$.NavigationBar.showBack();
}
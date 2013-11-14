/**
 * The detail navigation widget
 * 
 * @class Widgets.com.chariti.detailNavigation
 */
var APP = require("core");

/**
 * @member Widgets.com.chariti.detailNavigation
 * @property {Object} CONFIG
 * @property {Function} CONFIG.up The function to run on 'up' press
 */
var CONFIG = arguments[0] || {};

$.arrowUp.image = APP.Settings.colors.theme == "dark" ? "/icons/white/arrowUp.png" : "/icons/black/settings.png";
$.arrowDown.image = APP.Settings.colors.theme == "dark" ? "/icons/white/arrowDown.png" : "/icons/black/arrowDown.png";

if(CONFIG.up && typeof CONFIG.up == "function") {
	$.arrowUp.addEventListener("click", CONFIG.up);
} else {
	$.arrowUp.opacity = 0.4;
}

if(CONFIG.down && typeof CONFIG.down == "function") {
	$.arrowDown.addEventListener("click", CONFIG.down);
} else {
	$.arrowDown.opacity = 0.4;
}

// Move the UI down if iOS7+
if(OS_IOS && APP.Device.versionMajor >= 7) {
	$.Wrapper.top = "37dp";
}
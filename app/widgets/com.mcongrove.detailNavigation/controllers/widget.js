/**
 * The detail navigation widget
 * 
 * @class Widgets.com.mcongrove.detailNavigation
 */

/**
 * @member Widgets.com.mcongrove.detailNavigation
 * @property {Object} CONFIG
 * @property {Function} CONFIG.color The color of the icons (either "white" or "black")
 * @property {Function} CONFIG.up The function to run on 'up' press
 * @property {Function} CONFIG.down The function to run on 'down' press
 */
var CONFIG = arguments[0] || {};

$.arrowUp.image = CONFIG.color.toLowerCase() == "white" ? WPATH("/images/white/arrowUp.png") : WPATH("/images/black/arrowUp.png");
$.arrowDown.image = CONFIG.color.toLowerCase() == "white" ? WPATH("/images/white/arrowDown.png") : WPATH("/images/black/arrowDown.png");

if(CONFIG.up && typeof CONFIG.up == "function") {
	$.arrowUpWrapper.addEventListener("click", CONFIG.up);
} else {
	$.arrowUp.opacity = 0.4;
}

if(CONFIG.down && typeof CONFIG.down == "function") {
	$.arrowDownWrapper.addEventListener("click", CONFIG.down);
} else {
	$.arrowDown.opacity = 0.4;
}

// Move the UI down if iOS7+
if(OS_IOS && parseInt(Ti.Platform.version.split(".")[0], 10) >= 7) {
	$.Wrapper.top = "37dp";
}
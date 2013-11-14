/**
 * The toast notification widget
 * 
 * @class Widgets.com.chariti.toast
 */
var APP = require("core");

/**
 * @member Widgets.com.chariti.toast
 * @property {Object} CONFIG
 * @property {String} CONFIG.text The text to display in the toast
 * @property {Number} CONFIG.duration The length of time (ms) to display the toast
 */
var CONFIG = arguments[0] || {};

if(CONFIG.text) {
	$.textLabel.text = CONFIG.text;

	open();
	
	setTimeout(function() {
		close();
	}, CONFIG.duration ? (CONFIG.duration + 250) : 3000);
}

/**
 * Opens the toast notification
 * @private
 */
function open() {
	APP.GlobalWrapper.add($.Wrapper);
	
	$.Modal.animate({
		top: "20dp",
		duration: 250
	});
};

/**
 * Closes the toast notification
 * @private
 */
function close() {
	$.Modal.animate({
		top: "70dp",
		duration: 250
	}, function(_event) {
		APP.GlobalWrapper.remove($.Wrapper);
	});
};
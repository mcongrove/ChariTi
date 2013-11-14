/**
 * The toast notification widget
 * 
 * @class Widgets.com.chariti.toast
 */
var APP = require("core");

var CONFIG = arguments[0] || {};

if(CONFIG.text) {
	$.textLabel.text = CONFIG.text;

	open();
	
	setTimeout(function() {
		close();
	}, CONFIG.duration ? (CONFIG.duration + 250) : 3000);
}

function open() {
	APP.GlobalWrapper.add($.Wrapper);
	
	$.Modal.animate({
		top: "20dp",
		duration: 250
	});
};

function close() {
	$.Modal.animate({
		top: "70dp",
		duration: 250
	}, function(_event) {
		APP.GlobalWrapper.remove($.Wrapper);
	});
};
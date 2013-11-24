/**
 * Controller for the settings legal screen
 * 
 * @class Controllers.settings.legal
 * @uses core
 */
var APP = require("core");

var CONFIG = arguments[0];

/**
 * Initializes the controller
 */
$.init = function() {
	APP.log("debug", "settings_legal.init | " + JSON.stringify(CONFIG));

	$.container.url = CONFIG.url;
	$.container.scalesPageToFit = true;
	$.container.willHandleTouches = false;

	$.NavigationBar.setBackgroundColor(APP.Settings.colors.primary);
	$.NavigationBar.setTitle(CONFIG.title);

	$.NavigationBar.showBack(function(_event) {
		APP.removeChild(true);
	});
};

// Kick off the init
$.init();
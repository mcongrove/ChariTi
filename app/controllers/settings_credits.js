/**
 * Controller for the settings credits screen
 * 
 * @class Controllers.settings.credits
 * @uses core
 */
var APP = require("core");

/**
 * Initializes the controller
 */
$.init = function() {
	APP.log("debug", "settings_credits.init");

	$.NavigationBar.setBackgroundColor(APP.Settings.colors.primary);

	$.NavigationBar.showBack(function(_event) {
		APP.removeChild(true);
	});
};

// Kick off the init
$.init();
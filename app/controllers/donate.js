/**
 * Controller for the donate screen
 * 
 * @class Controllers.donate
 * @uses core
 */
var APP = require("core");

var CONFIG = arguments[0];

/**
 * Initializes the controller
 */
$.init = function() {
	APP.log("debug", "donate.init | " + JSON.stringify(CONFIG));

	$.heading.text = CONFIG.heading;
	$.heading.color = APP.Settings.colors.hsb.primary.b > 70 ? "#000" : APP.Settings.colors.primary;
	$.text.text = CONFIG.text;
	$.button.backgroundColor = APP.Settings.colors.hsb.primary.b > 70 ? "#000" : APP.Settings.colors.primary;
	$.buttonText.color = APP.Settings.colors.theme == "dark" ? "#FFF" : (APP.Settings.colors.hsb.primary.b > 70 ? "#FFF" : "#000");

	$.NavigationBar.setBackgroundColor(APP.Settings.colors.primary);

	if(CONFIG.isChild === true) {
		$.NavigationBar.showBack();
	}

	if(APP.Settings.useSlideMenu) {
		$.NavigationBar.showMenu();
	} else {
		$.NavigationBar.showSettings();
	}
};

// Event listeners
$.button.addEventListener("click", function(_event) {
	APP.log("debug", "donate @openLink");

	Ti.Platform.openURL(CONFIG.url);
});

// Kick off the init
$.init();
/**
 * Controller for the donate screen
 * 
 * @class Controllers.donate
 * @uses core
 */
var APP = require("core");

var CONFIG = arguments[0];

$.init = function() {
	APP.log("debug", "donate.init | " + JSON.stringify(CONFIG));

	$.heading.text = CONFIG.heading;
	$.heading.color = APP.Settings.colors.primary || "#666";
	$.text.text = CONFIG.text;
	$.button.backgroundColor = APP.Settings.colors.primary || "#000";
	$.buttonText.color = APP.Settings.colors.text || "#FFF";

	$.NavigationBar.setBackgroundColor(APP.Settings.colors.primary || "#000");

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
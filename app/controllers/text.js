/**
 * Controller for the text screen
 * 
 * @class Controllers.text
 * @uses core
 */
var APP = require("core");

var CONFIG = arguments[0];

APP.log("debug", "text | " + JSON.stringify(CONFIG));

$.heading.text = CONFIG.heading;
$.heading.color = APP.Settings.colors.hsb.primary.b > 70 ? "#000" : APP.Settings.colors.primary;
$.text.text = CONFIG.text;

$.NavigationBar.setBackgroundColor(APP.Settings.colors.primary);

if(CONFIG.isChild === true) {
	$.NavigationBar.showBack({
		callback: function(_event) {
			APP.removeChild();
		}
	});
}

if(APP.Settings.useSlideMenu) {
	$.NavigationBar.showMenu({
		callback: function(_event) {
			APP.toggleMenu();
		}
	});
} else {
	$.NavigationBar.showSettings({
		callback: function(_event) {
			APP.openSettings();
		}
	});
}
var APP = require("core");

var CONFIG = arguments[0];

APP.log("debug", "text | " + JSON.stringify(CONFIG));

$.heading.text = CONFIG.heading;
$.heading.color = APP.Settings.colors.primary || "#666";
$.text.text = CONFIG.text;

$.NavigationBar.setBackgroundColor(APP.Settings.colors.primary || "#FFF");

if(CONFIG.isChild === true) {
	$.NavigationBar.showBack();
}

if(APP.Settings.useSlideMenu) {
	$.NavigationBar.showMenu();
} else {
	$.NavigationBar.showSettings();
}
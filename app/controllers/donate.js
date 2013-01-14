var APP = require("core");

var CONFIG = arguments[0];

APP.log("debug", "donate | " + JSON.stringify(CONFIG));

$.heading.text				= CONFIG.heading;
$.heading.color				= APP.Settings.colors.primary || "#666";
$.text.text					= CONFIG.text;
$.button.backgroundColor	= APP.Settings.colors.primary || "#FFF";
$.button.color				= APP.Settings.colors.text || "#FFF";

$.NavigationBar.Wrapper.backgroundColor = APP.Settings.colors.primary || "#000";
$.NavigationBar.right.visible			= true;
$.NavigationBar.rightImage.image		= "/images/settings.png";

$.NavigationBar.right.addEventListener("click", function(_event) {
	APP.openSettings();
});

$.button.addEventListener("click", function(_event) {
	APP.log("debug", "donate @openLink");
	
	Ti.Platform.openURL(_event.url);
});
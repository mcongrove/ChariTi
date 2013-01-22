var APP = require("core");

var CONFIG = arguments[0];

$.init = function() {
	APP.log("debug", "donate.init | " + JSON.stringify(CONFIG));
	
	$.heading.text				= CONFIG.heading;
	$.heading.color				= APP.Settings.colors.primary || "#666";
	$.text.text					= CONFIG.text;
	$.button.backgroundColor	= APP.Settings.colors.primary || "#FFF";
	$.button.color				= APP.Settings.colors.text || "#FFF";
	
	$.NavigationBar.Wrapper.backgroundColor = APP.Settings.colors.primary || "#000";
	$.NavigationBar.right.visible			= true;
	$.NavigationBar.rightImage.image		= "/images/settings.png";
	
	if(CONFIG.isChild === true) {
		$.NavigationBar.back.visible		= true;
	}
};

// Event listeners
$.NavigationBar.back.addEventListener("click", function(_event) {
	APP.log("debug", "donate @close");
	
	APP.removeChild();
});

$.NavigationBar.right.addEventListener("click", function(_event) {
	APP.openSettings();
});

$.button.addEventListener("click", function(_event) {
	APP.log("debug", "donate @openLink");
	
	Ti.Platform.openURL(CONFIG.url);
});

// Kick off the init
$.init();
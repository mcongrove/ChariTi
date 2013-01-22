var APP = require("core");
var CONFIG = arguments[0];

$.init = function() {
	APP.log("debug", "settings_legal.init | " + JSON.stringify(CONFIG));
	
	$.NavigationBar.Wrapper.backgroundColor	= APP.Settings.colors.primary || "#000";
	$.NavigationBar.title.text				= CONFIG.title;
	$.NavigationBar.title.color				= APP.Settings.colors.text || "#FFF";
	$.NavigationBar.back.visible			= true;
	
	$.content.url = CONFIG.url;
	$.content.scalesPageToFit = true;
	$.content.willHandleTouches = false;
};

// Event listeners
$.NavigationBar.back.addEventListener("click", function(_event) {
	APP.log("debug", "settings_legal @close");
	
	APP.removeChild("settings");
});

// Kick off the init
$.init();
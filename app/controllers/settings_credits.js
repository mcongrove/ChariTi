var APP = require("core");

$.init = function() {
	APP.log("debug", "settings_credits.init");
	
	$.NavigationBar.Wrapper.backgroundColor	= APP.Settings.colors.primary || "#000";
	$.NavigationBar.back.visible			= true;
};

// Event listeners
$.NavigationBar.back.addEventListener("click", function(_event) {
	APP.log("debug", "settings_credits @close");
	
	APP.closeDetailScreen("settings");
});

// Kick off the init
$.init();
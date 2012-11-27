var APP = require("core");

var CONFIG = arguments[0];

$.init = function() {
	APP.log("debug", "donate.init | " + JSON.stringify(CONFIG));
	
	$.NavigationBar.Wrapper.backgroundColor = APP.Settings.colors.primary || "#000";
	
	$.content.url = "/data/" + CONFIG.file;
};

// Event listeners
Ti.App.addEventListener("APP:openLink", function(_event) {
	APP.log("debug", "donate @openLink");
	
	Ti.Platform.openURL(_event.url);
});

Ti.App.addEventListener("APP:openTab", function(_event) {
	APP.log("debug", "donate @openTab");
	
	APP.handleNavigation(_event.index);
});

// Kick off the init
$.init();
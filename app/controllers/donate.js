var APP = require("core");

var CONFIG = arguments[0];

$.init = function() {
	Ti.API.debug("donate.init");
	Ti.API.trace(JSON.stringify(CONFIG));
	
	$.NavigationBar.Wrapper.backgroundColor = APP.Settings.colors.primary || "#000";
	
	$.content.url = "/data/" + CONFIG.file;
};

// Event listeners
Ti.App.addEventListener("APP:openLink", function(_event) {
	Ti.API.debug("donate @openLink");
	
	Ti.Platform.openURL(_event.url);
});

Ti.App.addEventListener("APP:openTab", function(_event) {
	Ti.API.debug("donate @openTab");
	
	APP.handleNavigation(_event.index);
});

// Kick off the init
$.init();
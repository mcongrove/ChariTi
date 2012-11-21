var APP = require("core");

var CONFIG = arguments[0];

$.init = function() {
	Ti.API.debug("donate.init");
	Ti.API.trace(JSON.stringify(CONFIG));
	
	$.NavigationBar.Wrapper.backgroundColor = APP.Settings.colors.primary || "#000";
	
	$.content.url = "/data/" + CONFIG.file;
};

// Event listeners
Ti.App.addEventListener("linkclick", function(_event) {
	Ti.API.debug("donate @open");
	
	Ti.Platform.openURL(_event.url);
});

// Kick off the init
$.init();
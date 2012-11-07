var APP = require("core");

var CONFIG = arguments[0];

$.init = function() {
	$.TitleBar.Wrapper.backgroundColor = APP.Settings.colors.primary || "#000";
	
	$.content.url = CONFIG.file;
};

// Event listeners
Ti.App.addEventListener("linkclick", function(_event) {
	Ti.Platform.openURL(_event.url);
});

// Kick off the init
$.init();
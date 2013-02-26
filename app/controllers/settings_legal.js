var APP = require("core");

var CONFIG = arguments[0];

$.init = function() {
	APP.log("debug", "settings_legal.init | " + JSON.stringify(CONFIG));

	$.content.url = CONFIG.url;
	$.content.scalesPageToFit = true;
	$.content.willHandleTouches = false;

	$.NavigationBar.setBackgroundColor(APP.Settings.colors.primary || "#000");
	$.NavigationBar.setTitle(CONFIG.title);

	$.NavigationBar.showBack({
		callback: function(_event) {
			APP.removeChild(true);
		}
	});
};

// Kick off the init
$.init();
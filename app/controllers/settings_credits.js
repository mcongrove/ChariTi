var APP = require("core");

$.init = function() {
	APP.log("debug", "settings_credits.init");

	$.NavigationBar.setBackgroundColor(APP.Settings.colors.primary || "#000");

	$.NavigationBar.showBack({
		callback: function(_event) {
			APP.removeChild("settings");
		}
	});
};

// Kick off the init
$.init();
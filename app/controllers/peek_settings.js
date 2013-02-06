var APP = require("core");

$.refresh.addEventListener("click", function(_event) {
	APP.log("debug", "settings @refresh");

	// Update the configuration file
	require("update").init({
		url: Ti.App.Properties.getString("URL"),
		callback: function() {
			// Close the Settings screen
			APP.removeChild("settings");

			// Rebuild
			APP.rebuild();

			// Start the APP
			APP.init();
		}
	});
});

$.restart.addEventListener("click", function(_event) {
	APP.log("debug", "settings @restart");

	APP.PEEK.init();
});
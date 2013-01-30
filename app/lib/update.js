var APP = require("core");
var HTTP = require("http");

/**
 * Updates the app.json from a remote source
 */
exports.init = function() {
	APP.log("debug", "UPDATE.init");

	if(APP.ConfigurationURL) {
		HTTP.request({
			timeout: 10000,
			type: "GET",
			format: "DATA",
			url: APP.ConfigurationURL,
			success: exports.handleUpdate
		});
	}
};

/**
 * Handles the update with the new configuration file
 */
exports.handleUpdate = function(_data) {
	APP.log("debug", "UPDATE.handleUpdate");

	// Determine if this is the same version as we already have
	var data = JSON.parse(_data);

	if(data.version == APP.VERSION) {
		// We already have it
		APP.log("info", "Application is up-to-date");

		return;
	}

	// Grab the items from the manifest
	exports.updateManifest(data.manifest);

	// Write JSON file
	var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, "app.json");
	file.write(_data);
	file = null;

	// Alert the user about the update
	var dialog = Ti.UI.createAlertDialog({
		title: "Update Available",
		message: "New content has been downloaded."
	});

	dialog.addEventListener("click", function(_event) {
		APP.log("info", "Update accepted");

		APP.rebuild();
	});

	dialog.show();
};

/**
 * Retrieves remote items
 */
exports.updateManifest = function(_images) {
	APP.log("debug", "UPDATE.updateManifest");

	// Write manifest files
	for(var i = 0, x = _images.length; i < x; i++) {
		HTTP.request({
			timeout: 10000,
			type: "GET",
			format: "DATA",
			url: _images[i],
			success: exports.handleManifest
		});
	}
};

/**
 * Stores remote items locally
 */
exports.handleManifest = function(_data, _url) {
	APP.log("debug", "UPDATE.handleManifest");

	// Determine file name
	var filename = _url.substring(_url.lastIndexOf("/") + 1);

	// Write manifest file
	var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, filename);
	file.write(_data);
	file = null;
};
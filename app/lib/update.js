var APP = require("core");
var HTTP = require("http");

/**
 * Updates the app.json from a remote source
 * @param {Object} _params The parameters for the function, used to force an update
 */
exports.init = function(_params) {
	APP.log("debug", "UPDATE.init");

	if(_params) {
		HTTP.request({
			timeout: 10000,
			type: "GET",
			format: "DATA",
			url: _params.url,
			success: exports.handleUpdate,
			passthrough: _params.callback
		});
	} else if(APP.ConfigurationURL) {
		if(!Ti.App.Properties.getBool("OUTDATED", false)) {
			HTTP.request({
				timeout: 10000,
				type: "GET",
				format: "DATA",
				url: APP.ConfigurationURL,
				success: exports.handleUpdate
			});
		} else {
			// Un-supported configuration file, die
			APP.log("error", "Configuration file not supported by this version");
		}
	}
};

/**
 * Handles the update with the new configuration file
 * @param {String} [_data] The response data
 * @param {String} [_url] The URL we requested
 * @param {Function} [_callback] The optional callback function, used to force an update
 * 
 */
exports.handleUpdate = function(_data, _url, _callback) {
	APP.log("debug", "UPDATE.handleUpdate");

	// Determine if this is the same version as we already have
	var data = JSON.parse(_data);

	if(typeof _callback === "undefined") {
		if(data.version == APP.VERSION) {
			// We already have it
			APP.log("info", "Application is up-to-date");

			return;
		}
	}

	// Determine if this configuration file is supported by installed ChariTi version
	if(!Ti.App.Properties.getBool("OUTDATED", false)) {
		if(data.minimumVersion > Ti.App.Properties.getString("CVERSION", "1.0.0")) {
			// Un-supported configuration file, die
			APP.log("error", "Configuration file not supported by this version");

			// Don't prompt the user again
			Ti.App.Properties.setBool("OUTDATED", true);

			// Alert the user about the error updating
			var dialog = Ti.UI.createAlertDialog({
				title: "Update Available",
				message: "Please downloaded the latest version of this application"
			});

			dialog.show();

			return;
		}
	}

	// Grab the items from the manifest
	if(data.manifest) {
		exports.downloadManifest(data.manifest);
	}

	// Write JSON file
	var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, "app.json");
	file.write(_data);
	file = null;

	if(typeof _callback === "undefined") {
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
	} else {
		_callback();
	}
};

/**
 * Retrieves remote items
 * @param {Array} [_items] An array of items from the manifest
 */
exports.downloadManifest = function(_items) {
	APP.log("debug", "UPDATE.downloadManifest");

	// Write manifest files
	for(var i = 0, x = _items.length; i < x; i++) {
		HTTP.request({
			timeout: 10000,
			type: "GET",
			format: "DATA",
			url: _items[i],
			success: exports.handleManifestItem
		});
	}
};

/**
 * Stores remote items locally
 * @param {String} [_data] The content of the item we downloaded
 * @param {String} [_url] The URL of the item we downloaded
 */
exports.handleManifestItem = function(_data, _url) {
	APP.log("debug", "UPDATE.handleManifestItem");

	// Determine file name
	var filename = _url.substring(_url.lastIndexOf("/") + 1);

	// Write manifest file
	var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, filename);
	file.write(_data);
	file = null;
};
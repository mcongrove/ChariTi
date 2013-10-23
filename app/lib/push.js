/**
 * Push notification class
 * 
 * @class push
 * @uses core
 */
var APP = require("core");

/**
 * The device token
 * @type String
 */
exports.deviceToken = null;

/**
 * Initializes the push notifications based on selected vendor
 * @param {Function} _callback The callback to run after device registration
 */
var vendorInit = function(_callback) {
	if(APP.Settings.notifications.provider === "ACS") {
		require("push/acs").registerDevice(_callback);
	}

	if(APP.Settings.notifications.provider === "UA") {
		require("push/ua").registerDevice(_callback);
	}
};

/**
 * Registers the app for push notifications
 */
exports.init = function() {
	APP.log("debug", "PUSH.init");

	vendorInit(function() {
		APP.log("debug", "PUSH.init @success");
	});
};

/**
 * The function to run after a push has been received
 * @param {Object} _data The push data received
 */
exports.pushRecieved = function(_data) {
	APP.log("debug", "ACS.pushReceived");
	APP.log("trace", JSON.stringify(_data));

	var payload = null;

	if(_data.data) {
		payload = _data.data;
	} else if(_data.payload) {
		payload = JSON.parse(_data.payload);
		payload.alert = payload.android.alert;
	} else {
		return;
	}

	var dialog = Ti.UI.createAlertDialog({
		title: "Push Notification",
		message: payload.alert,
		buttonNames: ["OK", "Cancel"],
		cancel: 1
	});

	dialog.show();
};
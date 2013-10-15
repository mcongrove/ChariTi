var APP = require("core");

exports.deviceToken = null;

var vendorInit = function(callback) {
	if(APP.Settings.notifications.provider === "ACS") {
		require("push/acs").registerDevice(callback);
	}

	if(APP.Settings.notifications.provider === "UA") {
		require("push/ua").registerDevice(callback);
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

exports.pushRecieved = function(_data) {
	Ti.API.info("debug", "ACS.pushReceived");
	Ti.API.info("trace", JSON.stringify(_data));

	var payload = null;

	if(_data.data) {
		payload = _data.data;
	} else if(_data.payload) {
		payload = JSON.parse(_data.payload);
		payload.alert = payload.android.alert;
	} else {
		return;
	}

	Ti.API.info(JSON.stringify(payload));

	var dialog = Ti.UI.createAlertDialog({
		title: "Push Notification",
		message: payload.alert,
		buttonNames: ["OK", "Cancel"],
		cancel: 1
	});

	dialog.show();
};
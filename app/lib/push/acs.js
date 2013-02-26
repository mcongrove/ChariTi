var APP = require("core");
var PUSH = require("push");

exports.init = function() {
	APP.log("debug", "ACS.init");

	// We have to login into ACS first.
	require("user").init(function() {
		Ti.Network.registerForPushNotifications({
			types: [
                Ti.Network.NOTIFICATION_TYPE_BADGE,
                Ti.Network.NOTIFICATION_TYPE_ALERT,
                Ti.Network.NOTIFICATION_TYPE_SOUND
            ],
			success: function(_data) {
				APP.log("debug", "ACS.init @success");
				APP.log("trace", _data.deviceToken);
				
				PUSH.deviceToken = _data.deviceToken;
				
				exports.subscribe({
					channel: "all"
				});
			},
			error: function(_data) {
				APP.log("debug", "ACS.init @error");
				APP.log("trace", JSON.stringify(_data));
			},
			callback: function(_data) {
				exports.pushRecieved(_data.data);
			}
		});
	});
};

exports.subscribe = function(_params) {
	APP.log("debug", "ACS.subscribe");

	if(!PUSH.deviceToken || !_params.channel) {
		APP.log("error", "ACS.subscribe - Missing required parameter");
	}

	APP.ACS.PushNotifications.subscribe({
		channel: _params.channel,
		device_token: PUSH.deviceToken
	}, function(_event) {
		if(_event.success) {
			APP.log("debug", "ACS.subscribe @success");
		} else {
			APP.log("error", "ACS.subscribe @failure");
		}
	});

};

exports.pushRecieved = function(_data) {
	APP.log("debug", "ACS.pushReceived");
	APP.log("trace", JSON.stringify(_data));

	var dialog = Titanium.UI.createAlertDialog({
		title: "Push Notification",
		message: _data.alert,
		buttonNames: [ "OK", "Cancel" ],
		cancel: 1
	});

	dialog.show();

	dialog.addEventListener("click", function(_event) {
		if(_event.index === 0) {
			// _data.openPage specifies which page to open
		}
	});
};
var APP = require("core");
var PUSH = require("push");

if(OS_ANDROID) {
	var CloudPush = require('ti.cloudpush');

	var registerAndroid = function(callback) {

		CloudPush.retrieveDeviceToken({
			success: function(_data) {
				APP.log("debug", "ACS.registerAndroid @success");
				APP.log("trace", _data.deviceToken);

				PUSH.deviceToken = _data.deviceToken;
				Ti.App.Properties.setString("PUSH_DEVICETOKEN", _data.deviceToken);

				CloudPush.addEventListener('callback', function(evt) {
					PUSH.pushRecieved(evt);
					APP.log(JSON.stringify(evt));
				});

				callback();
			},
			error: function(_data) {
				APP.log("debug", "ACS.registerAndroid @error");
				APP.log("trace", JSON.stringify(_data));
			}
		});
	};
}

if(OS_IOS) {
	var registeriOS = function(callback) {
		APP.log("debug", "PUSH.registeriOS");

		Ti.Network.registerForPushNotifications({
			types: [
                Ti.Network.NOTIFICATION_TYPE_BADGE,
                Ti.Network.NOTIFICATION_TYPE_ALERT,
                Ti.Network.NOTIFICATION_TYPE_SOUND
            ],
			success: function(_data) {
				APP.log("debug", "ACS.registeriOS @success");
				APP.log("trace", _data.deviceToken);

				PUSH.deviceToken = _data.deviceToken;
				Ti.App.Properties.setString("PUSH_DEVICETOKEN", _data.deviceToken);

				callback();
			},
			error: function(_data) {
				APP.log("debug", "ACS.registeriOS @error");
				APP.log("trace", JSON.stringify(_data));
			},
			callback: function(_data) {
				PUSH.pushRecieved(_data);
				APP.log(JSON.stringify(_data));
			}
		});
	};
}

exports.registerDevice = function(callback) {
	APP.log("debug", "ACS.registerDevice");

	if(OS_IOS) {
		registeriOS(callback);
	}
	if(OS_ANDROID) {
		registerAndroid(callback);
	}
};
/**
 * ACS push notification class
 * 
 * @class push.acs
 * @uses core
 * @uses push
 * @uses ti.coudpush
 */
var APP = require("core");
var PUSH = require("push");

if(OS_ANDROID) {
	var CloudPush = require('ti.cloudpush');

	/**
	 * Registers an Android device for push notifications
 	 * @param {Function} _callback The function to run after registration is complete
 	 * @platform Android
	 */
	var registerAndroid = function(_callback) {
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

				_callback();
			},
			error: function(_data) {
				APP.log("debug", "ACS.registerAndroid @error");
				APP.log("trace", JSON.stringify(_data));
			}
		});
	};
}

if(OS_IOS) {
	/**
	 * Registers an iOS device for push notifications
 	 * @param {Function} _callback The function to run after registration is complete
 	 * @platform iOS
	 */
	var registeriOS = function(_callback) {
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

				_callback();
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

/**
 * Registers a device for push notifications
 * @param {Function} _callback The function to run after registration is complete
 */
exports.registerDevice = function(_callback) {
	APP.log("debug", "ACS.registerDevice");

	if(OS_IOS) {
		registeriOS(_callback);
	} else if(OS_ANDROID) {
		registerAndroid(_callback);
	}
};
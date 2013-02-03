var APP = require("core");

/**
 * Registers the app for push notifications
 */
exports.init = function() {
	APP.log("debug", "PUSH.init");

	exports.initUrbanAirship();
};

/**
 * Sets up UrbanAirship push
 */
exports.initUrbanAirship = function() {
	APP.log("debug", "PUSH.initUrbanAirship");

	var UA = require("ti.urbanairship");

	UA.options = {
		APP_STORE_OR_AD_HOC_BUILD: true,
		PRODUCTION_APP_KEY: APP.Settings.notifications.key,
		PRODUCTION_APP_SECRET: APP.Settings.notifications.secret,
		LOGGING_ENABLED: false
	};

	Ti.Network.registerForPushNotifications({
		types: [
			Ti.Network.NOTIFICATION_TYPE_BADGE,
			Ti.Network.NOTIFICATION_TYPE_ALERT,
			Ti.Network.NOTIFICATION_TYPE_SOUND
		],
		/**
		 * Fired after we've registered the device
		 * @param {Object} [_data] UrbanAirship data object
		 */
		success: function(_data) {
			APP.log("debug", "PUSH.initUrbanAirship @success");
			APP.log("trace", _data.deviceToken);

			UA.registerDevice(_data.deviceToken, {
				tags: [
					APP.ID,
					APP.Version,
					Ti.Platform.osname,
					Ti.Platform.locale
				]
			});
		},
		/**
		 * Fired on an error
		 * @param {Object} [_data] UrbanAirship data object
		 */
		error: function(_data) {
			APP.log("debug", "PUSH.initUrbanAirship @error");
			APP.log("trace", JSON.stringify(_data));
		},
		/**
		 * Fired when a push notification is received
		 * @param {Object} [_data] UrbanAirship data object
		 */
		callback: function(_data) {
			APP.log("debug", "PUSH.initUrbanAirship @callback");
			APP.log("trace", JSON.stringify(_data));

			UA.handleNotification(_data.data);

			if(_data.data.tab) {
				var tabIndex = parseInt(_data.data.tab) - 1;

				if(APP.Nodes[tabIndex]) {
					APP.handleNavigation(tabIndex);
				}
			}
		}
	});
};
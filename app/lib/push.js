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
		success: function(_event) {
			APP.log("debug", "PUSH.initUrbanAirship @success");
			APP.log("trace", _event.deviceToken);

			UA.registerDevice(_event.deviceToken, {
				tags: [
					APP.ID,
					APP.Version,
					Ti.Platform.osname,
					Ti.Platform.locale
				]
			});
		},
		error: function(_event) {
			APP.log("debug", "PUSH.initUrbanAirship @error");
			APP.log("trace", JSON.stringify(_event));
		},
		callback: function(_event) {
			APP.log("debug", "PUSH.initUrbanAirship @callback");
			APP.log("trace", JSON.stringify(_event));

			UA.handleNotification(_event.data);

			if(_event.data.tab) {
				var tabIndex = parseInt(_event.data.tab) - 1;

				if(APP.Nodes[tabIndex]) {
					APP.handleNavigation(tabIndex);
				}
			}
		}
	});
};
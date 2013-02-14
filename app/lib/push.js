var APP = require("core");

exports.deviceToken = null;

/**
 * Registers the app for push notifications
 */
exports.init = function() {
	APP.log("debug", "PUSH.init");

	if(OS_IOS) {
		if(APP.Settings.notifications.provider === "ACS") {
			require("push/acs").init();
		}

		if(APP.Settings.notifications.provider === "UA") {
			require("push/ua").init();
		}
	}
};
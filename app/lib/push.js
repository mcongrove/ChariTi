var APP = require("core");

var PUSH = {
	deviceToken: null,

	/**
	 * Registers the app for push notifications
	 */
	init: function() {
		APP.log("debug", "PUSH.init");

		if(APP.Settings.notifications.provider === 'ACS') {
			require('push/acs').init();
		}

		if(OS_IOS && APP.Settings.notifications.provider === 'UA') {
			require('push/ua').init();
		}
	},
	pushRecieved: function(payload) {
		var string = JSON.stringify(payload);
		var parsedObject = JSON.parse(string);

		var pushAlert = Titanium.UI.createAlertDialog({
			title: 'Push Notification',
			message: payload.alert,
			buttonNames: ['OK', 'Cancel'],
			cancel: 1
		});

		pushAlert.show();

		pushAlert.addEventListener('click', function(btnEvt) {
			if(btnEvt.index === 0) {
				Ti.API.info('TODO: Add page launcher.', parsedObject.openPage);
			}
		});
	}
};

module.exports = PUSH;
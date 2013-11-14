/**
 * Social sharing class
 * 
 * @class social
 * @uses core
 * @uses Modules.dk.napp.social
 */
var APP = require("core");

if(OS_IOS) {
	var SOCIAL = require("dk.napp.social");

	/**
	 * If Twitter is supported by the device
	 * @platform iOS
	 */
	exports.twitterSupported = SOCIAL.isTwitterSupported();

	/**
	 * If e-mail is supported by the device
	 * @platform iOS
	 */
	exports.emailSupported = Ti.UI.createEmailDialog().isSupported();

	/**
	 * If ActivityView is supported by the device
	 * @platform iOS
	 */
	exports.activitySupported = SOCIAL.isActivityViewSupported();

	/**
	 * Shares information via e-mail
	 * @param {String} _url The URL to share
	 * @platform iOS
	 */
	exports.email = function(_url) {
		if(exports.emailSupported) {
			var email = Ti.UI.createEmailDialog();

			email.html = true;
			email.messageBody = APP.Settings.share + "<br /><br /><a href='" + _url + "'>" + _url + "</a>";

			email.open();
		}
	};

	/**
	 * Shares information via Twitter
	 * @param {String} _url The URL to share
	 * @platform iOS
	 */
	exports.twitter = function(_url) {
		if(exports.twitterSupported) {
			SOCIAL.twitter({
				text: APP.Settings.share,
				url: _url
			});
		}
	};

	/**
	 * Opens the sharing menu for iOS 6+ users
	 * @param {String} _url The URL to share
	 * @param {Object} _view The view to attach the OptionDialog to (required for iPad)
	 * @platform iOS
	 */
	exports.shareActivityView = function(_url, _view) {
		var dialog = Ti.UI.createOptionDialog({
			options: ["Share", "Open in Safari", "Cancel"],
			cancel: 2,
			selectedIndex: 2
		});

		dialog.addEventListener("click", function(_event) {
			switch(_event.index) {
				case 0:
					if(APP.Device.name == "IPAD") {
						SOCIAL.activityPopover({
							text: APP.Settings.share + " " + _url,
							removeIcons: "print,copy,contact,camera,weibo",
							view: _view
						});
					} else {
						SOCIAL.activityView({
							text: APP.Settings.share + " " + _url,
							removeIcons: "print,copy,contact,camera,weibo"
						});
					}
					break;
				case 1:
					Ti.Platform.openURL(_url);
					break;
			}
		});

		if(_view === undefined) {
			dialog.show();
		} else {
			dialog.show({
				view: _view
			});
		}
	};
}

/**
 * Opens the sharing menu
 * 
 * **NOTE: Minimum iOS 6 for ActivityView, otherwise fall back to Twitter and e-mail**
 * @param {String} _url The URL to share
 * @param {Object} _view [iOS only] The view to attach the OptionDialog to (required for iPad)
 */
exports.share = function(_url, _view) {
	if(OS_IOS) {
		if(exports.activitySupported) {
			exports.shareActivityView(_url, _view);
		} else {
			var options = [];
			var mapping = [];

			if(exports.twitterSupported) {
				options.push("Share via Twitter");
				mapping.push("twitter");
			}

			if(exports.emailSupported) {
				options.push("Share via E-Mail");
				mapping.push("email");
			}

			options.push("Open in Safari");
			mapping.push("browser");

			options.push("Cancel");
			mapping.push("cancel");

			var dialog = Ti.UI.createOptionDialog({
				options: options,
				cancel: options.length - 1,
				selectedIndex: options.length - 1
			});

			dialog.addEventListener("click", function(_event) {
				switch(mapping[_event.index]) {
					case "twitter":
						exports.twitter(_url);
						break;
					case "email":
						exports.email(_url);
						break;
					case "browser":
						Ti.Platform.openURL(_url);
						break;
				}
			});

			if(_view === undefined) {
				dialog.show();
			} else {
				dialog.show({
					view: _view
				});
			}
		}
	} else if(OS_ANDROID) {
		var intent = Ti.Android.createIntent({
			action: Ti.Android.ACTION_SEND,
			type: "text/plain"
		});

		intent.putExtra(Ti.Android.EXTRA_TEXT, APP.Settings.share + " " + _url);

		Ti.Android.currentActivity.startActivity(intent);
	}
};
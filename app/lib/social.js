var APP = require("core");

if(OS_IOS) {
	var SOCIAL = require("dk.napp.social");

	exports.twitterSupported = SOCIAL.isTwitterSupported();
	exports.emailSupported = Ti.UI.createEmailDialog().isSupported();
	exports.activitySupported = SOCIAL.isActivityViewSupported();

	/**
	 * Shares information via e-mail
	 * @param {String} [_url] The URL to share
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
	 * @param {String} [_url] The URL to share
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
	 * Opens the sharing menu (min iOS 6 for ActivityView, otherwise fall back to Twitter and e-mail)
	 * @param {String} [_url] The URL to share
	 * @param {Object} [_view] The view to attach the OptionDialog to (required for iPad)
	 */
	exports.share = function(_url, _view) {
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
	};

	/**
	 * Opens the sharing menu for iOS 6 users
	 * @param {String} [_url] The URL to share
	 * @param {Object} [_view] The view to attach the OptionDialog to (required for iPad)
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
					SOCIAL.activityView({
						text: APP.Settings.share + " " + _url,
						removeIcons: "print,copy,contact,camera,weibo"
					});
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
} else if(OS_ANDROID) {
	/**
	 * Opens the sharing menu
	 * @param {String} [_url] The URL to share
	 */
	exports.share = function(_url) {
		var intent = Ti.Android.createIntent({
			action: Ti.Android.ACTION_SEND,
			type: "text/plain"
		});

		intent.putExtra(Ti.Android.EXTRA_TEXT, APP.Settings.share + " " + _url);

		Ti.Android.currentActivity.startActivity(intent);
	};
}
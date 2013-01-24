var APP = require("core");

if(OS_IOS) {
	var SOCIAL	= require("dk.napp.social");
	
	exports.twitterSupported	= SOCIAL.isTwitterSupported();
	exports.emailSupported		= Ti.UI.createEmailDialog().isSupported();
	exports.activitySupported	= SOCIAL.isActivityViewSupported();
	
	/**
	 * Shares information via e-mail
	 */
	exports.email = function(_url) {
		if(exports.emailSupported) {
			var email = Ti.UI.createEmailDialog();
			
			email.html			= true;
			email.messageBody	= APP.Settings.share + "<br /><br /><a href='" + _url + "'>" + _url + "</a>";
			
			email.open();
		}
	};
	
	/**
	 * Shares information via Twitter
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
	 * Retweets a tweet
	 */
	exports.twitterRetweet = function(_text, _username) {
		if(exports.twitterSupported) {
			var text = "RT @" + _username + ": " + _text;
			
			if(text.length > 140) {
				if(_text.length < 138) {
					text = "RT " + _text;
				} else {
					text = _text;
				}
			}
			
			SOCIAL.twitter({
				text: text
			});
		}
	};
	
	/**
	 * Replies to a tweet
	 */
	exports.twitterReply = function(_username) {
		if(exports.twitterSupported) {
			SOCIAL.twitter({
				text: "@" + _username + " "
			});
		}
	};
	
	/**
	 * Opens the sharing menu
	 * NOTE: Min iOS 6 for ActivityView, otherwise fall back to Twitter and e-mail 
	 */
	exports.share = function(_url) {
		if(exports.activitySupported) {
			SOCIAL.activityView({
				text: APP.Settings.share + " " + _url,
				removeIcons: "print,copy,contact,camera,weibo"
			});
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
			
			dialog.show();
		}
	};
} else if(OS_ANDROID) {
	exports.share = function(_url) {
		var intent = Ti.Android.createIntent({
			action: Ti.Android.ACTION_SEND,
			type: "text/plain"
		});
		
		intent.putExtra(Ti.Android.EXTRA_TEXT, APP.Settings.share + " " + _url);
		
		Ti.Android.currentActivity.startActivity(intent);
	};
}
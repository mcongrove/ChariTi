var APP = require("core");

if(OS_IOS) {
	var SOCIAL = require("dk.napp.social");
	
	exports.facebookSupported	= SOCIAL.isFacebookSupported();
	exports.twitterSupported	= SOCIAL.isTwitterSupported();
	exports.emailSupported		= Ti.UI.createEmailDialog().isSupported();
	
	/**
	 * Shares information via e-mail
	 */
	exports.email = function(_url) {
		var email = Ti.UI.createEmailDialog();
		
		if(email.isSupported()) {
			email.html			= true;
			email.subject		= APP.Settings.email.subject;
			email.messageBody	= APP.Settings.email.body + "<br /><br /><a href='" + _url + "'>" + _url + "</a><br /><br />" + APP.Settings.email.footer;
			
			email.open();
		}
	};
	
	/**
	 * Shares information via Facebook
	 */
	exports.facebook = function(_url) {
		if(exports.facebookSupported) {
			SOCIAL.facebook({
				text: APP.Settings.social,
				url: _url
			});
		}
	};
	
	/**
	 * Shares information via Twitter
	 */
	exports.twitter = function(_url) {
		if(exports.twitterSupported) {
			SOCIAL.twitter({
				text: APP.Settings.social,
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
	 */
	exports.share = function(_url) {
		var options = [];
		var mapping = [];
		
		if(exports.facebookSupported) {
			options.push("Share via Facebook");
			mapping.push("facebook");
		}
		
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
				case "facebook":
					exports.facebook(_url);
					break;
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
	};
} else if(OS_ANDROID) {
	exports.share = function(_url) {
		var intent = Ti.Android.createIntent({
			action: Ti.Android.ACTION_SEND,
			type: "text/plain"
		});
		
		intent.putExtra(Ti.Android.EXTRA_TEXT, APP.Settings.social + " " + _url);
		
		Ti.Android.currentActivity.startActivity(intent);
	};
}
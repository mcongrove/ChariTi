var APP = require("core");
var SOCIAL = require("dk.napp.social");

exports.emailSupported		= Ti.UI.createEmailDialog().isSupported();
exports.facebookSupported	= SOCIAL.isFacebookSupported();
exports.twitterSupported	= SOCIAL.isTwitterSupported();

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

exports.facebook = function(_url) {
	if(exports.facebookSupported) {
		SOCIAL.facebook({
			text: APP.Settings.facebook,
			url: _url
		});
	}
};

exports.twitter = function(_url) {
	if(exports.twitterSupported) {
		SOCIAL.twitter({
			text: APP.Settings.twitter,
			url: _url
		});
	}
};

exports.twitterRetweet = function(_text, _username) {
	if(exports.twitterSupported) {
		SOCIAL.twitter({
			text: "RT @" + _username + ": " + _text
		});
	}
};

exports.twitterReply = function(_username) {
	if(exports.twitterSupported) {
		SOCIAL.twitter({
			text: "@" + _username + " "
		});
	}
};
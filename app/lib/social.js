var APP = require("core");

/**
 * Shares information via e-mail
 */
exports.email = function(_text) {
	var email = Ti.UI.createEmailDialog();
	
	if(email.isSupported()) {
		email.html			= true;
		email.subject		= APP.Settings.emailSettings.subject;
		email.messageBody	= APP.Settings.emailSettings.body + _text + APP.Settings.emailSettings.footer;
		
		email.open();
	} else {
		alert("E-mail is not set up on this device");
	}
};
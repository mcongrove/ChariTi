var APP = require("core");
var SOCIAL = require("social");

var DATA = arguments[0] || {};

$.Wrapper.id		= DATA.id || 0;
$.heading.text		= DATA.heading || "";
$.subHeading.color	= APP.Settings.colors.primary || "#000";
$.subHeading.text	= DATA.subHeading || "";

if(SOCIAL.twitterSupported) {
	$.Wrapper.addEventListener("click", function(_event) {
		var dialog = Ti.UI.createOptionDialog({
			options: [ "Retweet", "Reply", "Cancel" ],
			cancel: 2,
			selectedIndex: 2
		});
		
		dialog.addEventListener("click", function(_event) {
			switch(_event.index) {
				case 0: //Retweet
					SOCIAL.twitterRetweet(DATA.heading, DATA.username);
					break;
				case 1: //Reply
					SOCIAL.twitterReply(DATA.username);
					break;
			}
		});
		
		dialog.show();
	});
}
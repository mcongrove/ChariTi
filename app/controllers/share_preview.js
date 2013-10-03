var APP = require("core");

var CONFIG = arguments[0] || {};

$.Wrapper.id = CONFIG.id || 0;
$.title.text = CONFIG.title || "";
$.text.text = CONFIG.text.replace(/\s*<br[^>]*>\s*/ig, "\n").replace(/<[^>]*>/g, "") || "";
$.buttonConfirm.color = APP.Settings.colors.primary || "#000";

$.NavigationBar.setBackgroundColor(APP.Settings.colors.primary || "#000");

if(APP.Device.isHandheld) {
	$.NavigationBar.showBack({
		callback: function(_event) {
			APP.removeAllChildren();
		}
	});
}

// Event listeners
$.buttonConfirm.addEventListener("click", function(_event) {
	if(!Ti.UI.createEmailDialog().isSupported()) {
		alert("E-mail is not supported on your device.");

		return;
	}

	APP.addChild("share_contacts", {
		title: CONFIG.title,
		text: CONFIG.text
	});
});
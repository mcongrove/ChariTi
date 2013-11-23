/**
 * Controller for the share preview screen
 * 
 * @class Controllers.share.preview
 * @uses core
 */
var APP = require("core");

var CONFIG = arguments[0] || {};

$.Wrapper.id = CONFIG.id || 0;
$.title.text = CONFIG.title || "";
$.title.color = APP.Settings.colors.hsb.primary.b > 70 ? "#000" : APP.Settings.colors.primary;
$.text.text = CONFIG.text.replace(/\s*<br[^>]*>\s*/ig, "\n").replace(/<[^>]*>/g, "") || "";

$.NavigationBar.setBackgroundColor(APP.Settings.colors.primary);

if(APP.Device.isHandheld) {
	$.NavigationBar.showBack({
		callback: function(_event) {
			APP.removeChild();
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
/**
 * Controller for the share contacts table row
 * 
 * @class Controllers.share.contacts.row
 * @uses core
 */
var APP = require("core");

var CONFIG = arguments[0] || {};

var isChecked = false;

$.Wrapper.id = CONFIG.id || 0;
$.heading.text = CONFIG.heading || "";
$.subHeading.text = CONFIG.subHeading || "";

if(OS_IOS && CONFIG.header) {
	$.Wrapper.header = CONFIG.header;
}

$.Wrapper.addEventListener("click", function(_event) {
	if(isChecked) {
		$.check.visible = false;
		isChecked = false;
	} else {
		$.check.visible = true;
		isChecked = true;
	}
});
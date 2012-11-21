var APP = require("core");

var CONFIG = arguments[0];

Ti.API.debug("text");
Ti.API.info(JSON.stringify(CONFIG));

$.heading.text	= CONFIG.heading;
$.heading.color = APP.Settings.colors.primary || "#666";
$.text.text		= CONFIG.text;

$.NavigationBar.Wrapper.backgroundColor = APP.Settings.colors.primary || "#000";
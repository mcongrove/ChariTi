var APP = require("core");

var CONFIG = arguments[0];

Ti.API.debug("text");
Ti.API.info(JSON.stringify(CONFIG));

$.heading.text	= CONFIG.heading;
$.text.text		= CONFIG.text;

$.TitleBar.Wrapper.backgroundColor = APP.Settings.colors.primary || "#000";
$.heading.color = APP.Settings.colors.primary || "#666";
var APP = require("core");

var CONFIG = arguments[0];

$.heading.text	= CONFIG.heading;
$.text.text		= CONFIG.text;

$.TitleBar.Wrapper.backgroundColor = APP.Settings.colors.primary || "#000";
var APP = require("core");

var CONFIG = arguments[0];

APP.log("debug", "text | " + JSON.stringify(CONFIG));

$.heading.text	= CONFIG.heading;
$.heading.color = APP.Settings.colors.primary || "#666";
$.text.text		= CONFIG.text;

$.NavigationBar.Wrapper.backgroundColor = APP.Settings.colors.primary || "#000";
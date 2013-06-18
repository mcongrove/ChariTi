var APP = require("core");

var CONFIG = arguments[0] || {};

$.Wrapper.id = CONFIG.id || 0;
$.heading.text = CONFIG.heading || "";
$.subHeading.color = APP.Settings.colors.primary || "#000";
$.subHeading.text = CONFIG.subHeading || "";
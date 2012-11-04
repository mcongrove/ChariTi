var APP = require("core");

var DATA = arguments[0] || {};

$.NavigationBar.title.text				= DATA.title || "";
$.NavigationBar.title.color				= APP.Settings.colors.text || "#FFF";
$.NavigationBar.Wrapper.backgroundColor	= APP.Settings.colors.primary || "#000";

$.content.url				= DATA.url || "";

// Event listeners
$.NavigationBar.back.addEventListener("click", function(_event) {
	APP.closeDetailScreen();
});
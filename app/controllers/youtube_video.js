var APP = require("core");

var DATA = arguments[0] || {};

$.NavigationBar.title.text	= DATA.title;
$.content.url				= DATA.url || "";

// Event listeners
$.NavigationBar.back.addEventListener("click", function(_event) {
	APP.closeDetailScreen();
});
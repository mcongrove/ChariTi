var APP = require("core");
var UTIL = require("utilities");
var MODEL = require("models/blog");

var DATA = arguments[0] || {};

$.init = function() {
	$.handleData(MODEL.getArticle(DATA.id));
};

$.handleData = function(_data) {
	$.heading.text	= _data.title;
	$.text.text		= _data.description;
	$.date.text		= UTIL.toDateRelative(_data.date);
	
	$.NavigationBar.title.text = "Blog Entry";
};

// Event listeners
$.NavigationBar.back.addEventListener("click", function(_event) {
	APP.closeDetailScreen();
});

// Kick off the init
$.init();
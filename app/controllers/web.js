var APP = require("core");
var UTIL = require("utilities");

var CONFIG = arguments[0];

$.init = function() {
	if(CONFIG.url) {
		$.content.url				= CONFIG.url;
		$.content.scalesPageToFit	= true;
		$.content.willHandleTouches	= false;
		
		$.initToolbar();
	} else {
		$.content.html				= CONFIG.html;
	}
};

$.initToolbar = function() {
	$.toolbar.visible = true;
	
	var width = Math.floor(Ti.Platform.displayCaps.platformWidth / 4);
	
	$.containerBack.width		= width + "dp";
	$.containerForward.width	= width + "dp";
	$.containerRefresh.width	= width + "dp";
	$.containerStop.width		= width + "dp";
	$.containerStop.left		= 0 - width + "dp";
	$.containerStop.visible		= false;
	$.containerSafari.width		= width + "dp";
};

// Event listeners
$.content.addEventListener("load", function(_event) {
	if($.content.canGoBack()) {
		$.containerBack.visible	= true;
	} else {
		$.containerBack.visible	= false;
	}
	
	if($.content.canGoForward()) {
		$.containerForward.visible	= true;
	} else {
		$.containerForward.visible	= false;
	}
	
	$.containerStop.visible		= false;
	$.containerRefresh.visible	= true;
});

$.content.addEventListener("beforeload", function(_event) {
	$.containerRefresh.visible	= false;
	$.containerStop.visible		= true;
});

$.containerBack.addEventListener("click", function(_event) {
	$.content.goBack();
});

$.containerForward.addEventListener("click", function(_event) {
	$.content.goForward();
});

$.containerRefresh.addEventListener("click", function(_event) {
	$.content.reload();
	
	$.containerRefresh.visible	= false;
	$.containerStop.visible		= true;
});

$.containerStop.addEventListener("click", function(_event) {
	$.content.stopLoading();
	
	$.containerStop.visible		= false;
	$.containerRefresh.visible	= true;
});

$.containerSafari.addEventListener("click", function(_event) {
	Ti.Platform.openURL(CONFIG.url);
});

// Kick off the init
$.init();
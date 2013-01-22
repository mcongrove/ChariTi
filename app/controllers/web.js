var APP = require("core");
var CONFIG = arguments[0];

var currentUrl = '';

$.init = function() {
	APP.log("debug", "web.init | " + JSON.stringify(CONFIG));

	$.NavigationBar.Wrapper.backgroundColor = APP.Settings.colors.primary || "#000";
	$.NavigationBar.right.visible			= true;
	$.NavigationBar.rightImage.image		= "/images/settings.png";

	if(CONFIG.isChild === true) {
		$.NavigationBar.back.visible		= true;
	}
	
	if(CONFIG.url) {
		$.content.url = CONFIG.url;
		$.content.scalesPageToFit = true;
		$.content.willHandleTouches = false;
		
		$.initToolbar();
	} else if(CONFIG.file) {
		$.content.url = "/data/" + CONFIG.file;
	} else {
		$.content.html = CONFIG.html;
	}
};

$.initToolbar = function() {
	APP.log("debug", "web.initToolbar");
	
	$.toolbar.visible = true;
	$.content.bottom = "48dp";
	
	var width = Math.floor(Ti.Platform.displayCaps.platformWidth / 4);
	
	$.containerBack.width		= width + "dp";
	$.containerBack.visible		= false;
	$.containerForward.width	= width + "dp";
	$.containerForward.visible	= false;
	$.containerRefresh.width	= width + "dp";
	$.containerStop.width		= width + "dp";
	$.containerStop.left		= 0 - width + "dp";
	$.containerStop.visible		= false;
	$.containerSafari.width		= width + "dp";
};

// Event listeners
if(CONFIG.url) {
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

		currentUrl = _event.url;
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
		APP.log("debug", "web @open");
		
		Ti.Platform.openURL(currentUrl);
	});
} else {
	Ti.App.addEventListener("APP:openTab", function(_event) {
		APP.log("debug", "web @openTab");
		
		APP.handleNavigation(_event.index);
	});
}

// Event listeners
$.NavigationBar.back.addEventListener("click", function(_event) {
	APP.log("debug", "web @close");
	
	APP.removeChild();
});

$.NavigationBar.right.addEventListener("click", function(_event) {
	APP.openSettings();
});

// Kick off the init
$.init();
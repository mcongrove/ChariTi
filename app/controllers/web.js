/**
 * Controller for the web view screen
 * 
 * @class Controllers.web
 * @uses core
 */
var APP = require("core");

var CONFIG = arguments[0];

var currentUrl = "";

/**
 * Initializes the controller
 */
$.init = function() {
	APP.log("debug", "web.init | " + JSON.stringify(CONFIG));

	if(CONFIG.url) {
		$.container.url = CONFIG.url;
		$.container.scalesPageToFit = true;
		$.container.willHandleTouches = false;

		$.initToolbar();
	} else if(CONFIG.file) {
		$.container.url = "/data/" + CONFIG.file;
	} else {
		$.container.html = CONFIG.html;
	}

	$.NavigationBar.setBackgroundColor(APP.Settings.colors.primary);

	if(CONFIG.isChild === true) {
		$.NavigationBar.showBack(function(_event) {
			APP.removeChild();
		});
	}

	if(APP.Settings.useSlideMenu) {
		$.NavigationBar.showMenu(function(_event) {
			APP.toggleMenu();
		});
	} else {
		$.NavigationBar.showSettings(function(_event) {
			APP.openSettings();
		});
	}

	// Move the UI down if iOS7+
	// NOTE: This is because of problems surrounding a vertical layout on the wrapper
	//       so we have to bump down the container (47dp normally, 67dp for iOS 7+)
	if(OS_IOS && APP.Device.versionMajor >= 7) {
		$.container.top = "67dp";
	}
};

/**
 * Initializes the navigation toolbar
 */
$.initToolbar = function() {
	APP.log("debug", "web.initToolbar");

	$.toolbar.visible = true;
	$.container.bottom = "44dp";

	var width = Math.floor(APP.Device.width / 4);

	$.containerBack.width = width + "dp";
	$.containerBack.visible = false;
	$.containerForward.width = width + "dp";
	$.containerForward.visible = false;
	$.containerRefresh.width = width + "dp";
	$.containerStop.width = width + "dp";
	$.containerStop.left = 0 - width + "dp";
	$.containerStop.visible = false;
	$.containerSafari.width = width + "dp";
};

// Event listeners
if(CONFIG.url) {
	$.container.addEventListener("load", function(_event) {
		if($.container.canGoBack()) {
			$.containerBack.visible = true;
		} else {
			$.containerBack.visible = false;
		}

		if($.container.canGoForward()) {
			$.containerForward.visible = true;
		} else {
			$.containerForward.visible = false;
		}

		$.containerStop.visible = false;
		$.containerRefresh.visible = true;
	});

	$.container.addEventListener("beforeload", function(_event) {
		$.containerRefresh.visible = false;
		$.containerStop.visible = true;

		currentUrl = _event.url;
	});

	$.containerBack.addEventListener("click", function(_event) {
		$.container.goBack();
	});

	$.containerForward.addEventListener("click", function(_event) {
		$.container.goForward();
	});

	$.containerRefresh.addEventListener("click", function(_event) {
		$.container.reload();

		$.containerRefresh.visible = false;
		$.containerStop.visible = true;
	});

	$.containerStop.addEventListener("click", function(_event) {
		$.container.stopLoading();

		$.containerStop.visible = false;
		$.containerRefresh.visible = true;
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

// Kick off the init
$.init();
/**
 * The navigation bar widget
 * 
 * @class Widgets.com.chariti.navigationBar
 * @uses core
 */
var APP = require("core");

/**
 * @member Widgets.com.chariti.navigationBar
 * @property {Object} CONFIG
 * @property {String} CONFIG.image The image to show in the navigation bar (optional)
 * @property {String} CONFIG.text The text to show in the navigation bar (optional)
 */
var CONFIG = arguments[0] || {};

var navigation;

if(CONFIG.image) {
	var image = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, CONFIG.image);

	if(image.exists()) {
		image = image.nativePath;
	} else {
		image = "/data/" + CONFIG.image;
	}

	$.title = Ti.UI.createImageView({
		image: image,
		height: "26dp",
		width: Ti.UI.SIZE,
		top: (OS_IOS && APP.Device.versionMajor >= 7) ? "30dp" : "10dp",
		bottom: "10dp",
		preventDefaultImage: true
	});
} else {
	$.title = Ti.UI.createLabel({
		top: (OS_IOS && APP.Device.versionMajor >= 7) ? "20dp" : "0dp",
		left: "58dp",
		right: "58dp",
		height: "46dp",
		font: {
			fontSize: "18dp",
			fontFamily: "HelveticaNeue-Medium"
		},
		color: APP.Settings.colors.theme == "dark" ? "#FFF" : "#000",
		textAlign: "center",
		text: CONFIG.text ? CONFIG.text : ""
	});
}

$.backImage.image = APP.Settings.colors.theme == "dark" ? "/icons/white/back.png" : "/icons/black/back.png";
$.nextImage.image = APP.Settings.colors.theme == "dark" ? "/icons/white/next.png" : "/icons/black/next.png";

/**
 * Adds the navigation bar to the passed view
 * @param {Object} _view The view to add the navigation bar to
 */
$.addNavigation = function(_view) {
	navigation = _view;

	$.Wrapper.add(navigation);
};

/**
 * Removes the navigation bar from the passed view
 * @param {Object} _view The view to remove from the navigation bar
 */
$.removeNavigation = function() {
	$.Wrapper.remove(navigation);
};

/**
 * Sets the background color
 * @param {Object} _color The hex color code (e.g. "#FFF")
 */
$.setBackgroundColor = function(_color) {
	$.Wrapper.backgroundColor = _color;
};

/**
 * Sets the title
 * @param {Object} _text The title text
 */
$.setTitle = function(_text) {
	$.title.text = _text;
};

/**
 * Shows the back button
 * @param {Object} _params
 * @param {Function} _params.callback The function to run on back button press
 */
$.showBack = function(_params) {
	$.back.visible = true;

	if(_params && typeof _params.callback !== "undefined") {
		$.back.addEventListener("click", _params.callback);
	} else {
		$.back.addEventListener("click", function(_event) {
			APP.removeChild();
		});
	}
};

/**
 * Shows the next button
 * @param {Object} _params
 * @param {Function} _params.callback The function to run on next button press
 */
$.showNext = function(_params) {
	$.next.visible = true;

	$.next.addEventListener("click", _params.callback);
};

/**
 * Shows the left button
 * @param {Object} _params
 * @param {Function} _params.callback The function to run on left button press
 * @param {String} _params.image The image to show for the left button
 */
$.showLeft = function(_params) {
	$.left.visible = true;
	$.leftImage.image = _params.image;
	$.left.addEventListener("click", _params.callback);
};

/**
 * Shows the right button
 * @param {Object} _params
 * @param {Function} _params.callback The function to run on right button press
 * @param {String} _params.image The image to show for the right button
 */
$.showRight = function(_params) {
	$.right.visible = true;
	$.rightImage.image = _params.image;
	$.right.addEventListener("click", _params.callback);
};

/**
 * Shows the menu button
 */
$.showMenu = function() {
	$.showLeft({
		image: APP.Settings.colors.theme == "dark" ? "/icons/white/menu.png" : "/icons/black/menu.png",
		callback: APP.toggleMenu
	});
};

/**
 * Shows the settings button
 */
$.showSettings = function() {
	$.showRight({
		image: APP.Settings.colors.theme == "dark" ? "/icons/white/settings.png" : "/icons/black/settings.png",
		callback: APP.openSettings
	});
};

/**
 * Shows the action button
 * @param {Object} _params
 * @param {Function} _params.callback The function to run on action button press
 */
$.showAction = function(_params) {
	$.showRight({
		image: APP.Settings.colors.theme == "dark" ? "/icons/white/action.png" : "/icons/black/action.png",
		callback: _params.callback
	});
};

$.Wrapper.add($.title);

// Move the UI down if iOS7+
if(OS_IOS && APP.Device.versionMajor >= 7) {
	$.Wrapper.height = "67dp";
	$.overlay.top = "20dp";
}
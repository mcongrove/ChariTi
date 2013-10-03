var APP = require("core");
var CONFIG = arguments[0] || {};

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
		color: "#FFF",
		textAlign: "center",
		text: CONFIG.text ? CONFIG.text : ""
	});
}

$.addNavigation = function(_view) {
	$.Wrapper.add(_view);
};

$.setBackgroundColor = function(_color) {
	$.Wrapper.backgroundColor = _color;
};

$.setTitle = function(_text) {
	$.title.text = _text;
};

$.showBack = function(_params) {
	$.back.visible = true;
	
	if(_params && typeof _params.callback !== "undefined") {
		$.back.addEventListener("click",  _params.callback);
	} else {
		$.back.addEventListener("click",  function(_event) {
			APP.removeChild();
		});
	}
};

$.showLeft = function(_params) {
	$.left.visible = true;
	$.leftImage.image = _params.image;
	$.left.addEventListener("click", _params.callback);
};

$.showRight = function(_params) {
	$.right.visible = true;
	$.rightImage.image = _params.image;
	$.right.addEventListener("click", _params.callback);
};

$.showMenu = function() {
	$.showLeft({
		image: WPATH("images/menu.png"),
		callback: APP.toggleMenu
	});
};

$.showSettings = function() {
	$.showRight({
		image: WPATH("images/settings.png"),
		callback: APP.openSettings
	});
};

$.showAction = function(_params) {
	$.showRight({
		image: WPATH("images/action.png"),
		callback: _params.callback
	});
};

$.Wrapper.add($.title);

// Move the UI down if iOS7+
if(OS_IOS && APP.Device.versionMajor >= 7) {
	$.Wrapper.height = "67dp";
	$.overlay.top = "20dp";
}
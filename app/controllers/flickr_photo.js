var APP = require("core");

var MODEL = (function() {
	var Model = require("models/flickr");

	return new Model();
})();

var CONFIG = arguments[0] || {};
var PREVIOUS = null;
var NEXT = null;

var metaVisible = false;

$.init = function() {
	APP.log("debug", "flickr_photo.init | " + JSON.stringify(CONFIG));

	MODEL.init(CONFIG.index);

	$.handleData(MODEL.getPhoto(CONFIG.id));
};

$.handleData = function(_data) {
	APP.log("debug", "flickr_photo.handleData");

	PREVIOUS = MODEL.getPhoto(null, (parseInt(_data.index, 10) - 1).toString());
	NEXT = MODEL.getPhoto(null, (parseInt(_data.index, 10) + 1).toString());

	$.NavigationBar.Wrapper.backgroundColor = APP.Settings.colors.primary || "#000";
	$.NavigationBar.back.visible = true;

	$.image.image = _data.url_m;
	$.title.text = _data.title ? _data.title : "";
	$.description.text = _data.description ? _data.description.substring(0, 150) : "";
	$.meta.visible = false;
};

// Event listeners
$.content.addEventListener("singletap", function(_event) {
	if(metaVisible) {
		metaVisible = false;
		$.meta.visible = false;
	} else {
		metaVisible = true;
		$.meta.visible = true;
	}
});

$.content.addEventListener("swipe", function(_event) {
	if(_event.direction == "right") {
		if(PREVIOUS) {
			APP.log("debug", "flickr_photo @previous");

			CONFIG.id = PREVIOUS.id;
			PREVIOUS = null;
			NEXT = null;
			metaVisible = false;
			$.meta.visible = false;

			$.init();
		}
	} else if(_event.direction == "left") {
		if(NEXT) {
			APP.log("debug", "flickr_photo @next");

			CONFIG.id = NEXT.id;
			PREVIOUS = null;
			NEXT = null;
			metaVisible = false;
			$.meta.visible = false;

			$.init();
		}
	}
});

$.NavigationBar.back.addEventListener("click", function(_event) {
	APP.log("debug", "flickr_photo @close");

	APP.removeChild();
});

// Kick off the init
$.init();
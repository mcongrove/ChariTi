var APP = require("core");
var DATE = require("alloy/moment");
var STRING = require("alloy/string");
var MODEL = require("models/vimeo")();

var CONFIG = arguments[0];
var SELECTED;

$.init = function() {
	APP.log("debug", "vimeo.init | " + JSON.stringify(CONFIG));

	MODEL.init(CONFIG.index);

	CONFIG.feed = "http://vimeo.com/api/v2/" + CONFIG.username + "/videos.json";

	APP.openLoading();

	$.retrieveData();

	$.NavigationBar.Wrapper.backgroundColor = APP.Settings.colors.primary || "#000";
	$.NavigationBar.right.visible = true;
	$.NavigationBar.rightImage.image = "/images/settings.png";

	if(CONFIG.isChild === true) {
		$.NavigationBar.back.visible = true;
	}
};

$.retrieveData = function() {
	MODEL.fetch({
		url: CONFIG.feed,
		cache: CONFIG.cache,
		callback: $.handleVideos
	});
};

$.handleVideos = function() {
	APP.log("debug", "vimeo.handleVideos");

	var data = MODEL.getVideos();
	var rows = [];

	for(var i = 0, x = data.length; i < x; i++) {
		var row = Alloy.createController("vimeo_row", {
			id: data[i].id,
			url: data[i].link,
			heading: data[i].title,
			subHeading: STRING.ucfirst(DATE(data[i].date, "YYYY/MM/DD HH:mm:ss").fromNow())
		}).getView();

		rows.push(row);
	}

	$.content.setData(rows);

	APP.closeLoading();

	if(APP.Device.isTablet && !SELECTED) {
		SELECTED = data[0].id;

		APP.addChild("vimeo_video", {
			url: data[0].link,
			title: data[0].title,
			index: CONFIG.index
		});
	}
};

// Event listeners
$.NavigationBar.back.addEventListener("click", function(_event) {
	APP.log("debug", "vimeo @close");

	APP.removeChild();
});

$.NavigationBar.right.addEventListener("click", function(_event) {
	APP.openSettings();
});

$.content.addEventListener("click", function(_event) {
	APP.log("debug", "vimeo @click " + _event.row.url);

	if(APP.Device.isTablet) {
		if(_event.row.id == SELECTED) {
			return;
		} else {
			SELECTED = _event.row.id;
		}
	}

	APP.addChild("vimeo_video", {
		url: _event.row.url,
		title: _event.row.setTitle,
		index: CONFIG.index
	});
});

// Kick off the init
$.init();
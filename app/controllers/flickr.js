var APP = require("core");

var MODEL = (function() {
	var Model = require("models/flickr");

	return new Model();
})();

var CONFIG = arguments[0];
var SELECTED;

$.init = function() {
	APP.log("debug", "flickr.init | " + JSON.stringify(CONFIG));

	MODEL.init(CONFIG.index);

	APP.openLoading();

	MODEL.setApiKey(CONFIG.apiKey);

	$.retrieveData();

	$.NavigationBar.Wrapper.backgroundColor = APP.Settings.colors.primary || "#000";
	$.NavigationBar.right.visible = true;
	$.NavigationBar.rightImage.image = "/images/settings.png";

	if(CONFIG.isChild === true) {
		$.NavigationBar.back.visible = true;
	}
};

$.retrieveData = function() {
	MODEL.generateNsid({
		username: CONFIG.username,
		callback: $.handleNsid
	});
};

$.handleNsid = function() {
	APP.log("debug", "flickr.handleNsid");

	MODEL.retrieveSets({
		cache: CONFIG.cache,
		callback: $.handleSets
	});
};

$.handleSets = function() {
	APP.log("debug", "flickr.handleSets");

	var data = MODEL.getSets();
	var rows = [];

	for(var i = 0, x = data.length; i < x; i++) {
		var row = Alloy.createController("flickr_row", {
			id: data[i].id,
			heading: data[i].title,
			subHeading: data[i].photo_count + " Photos"
		}).getView();

		rows.push(row);
	}

	$.content.setData(rows);

	APP.closeLoading();

	if(APP.Device.isTablet) {
		SELECTED = data[0].id;

		APP.addChild("flickr_album", {
			id: data[0].id,
			title: data[0].title,
			cache: CONFIG.cache,
			index: CONFIG.index
		});
	}
};

// Event listeners
$.NavigationBar.back.addEventListener("click", function(_event) {
	APP.log("debug", "flickr @close");

	APP.removeChild();
});

$.NavigationBar.right.addEventListener("click", function(_event) {
	APP.openSettings();
});

$.content.addEventListener("click", function(_event) {
	APP.log("debug", "flickr @click " + _event.row.id);

	if(APP.Device.isTablet) {
		if(_event.row.id == SELECTED) {
			return;
		} else {
			SELECTED = _event.row.id;
		}
	}

	APP.addChild("flickr_album", {
		id: _event.row.id,
		cache: CONFIG.cache,
		title: _event.row.setTitle,
		index: CONFIG.index
	});
});

// Kick off the init
$.init();
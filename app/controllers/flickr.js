var APP = require("core");
var MODEL = require("models/flickr")();

var CONFIG = arguments[0];
var SELECTED;

$.init = function() {
	APP.log("debug", "flickr.init | " + JSON.stringify(CONFIG));

	APP.openLoading();

	MODEL.init(CONFIG.index);
	MODEL.setApiKey(CONFIG.apiKey);

	$.retrieveData();

	$.NavigationBar.setBackgroundColor(APP.Settings.colors.primary || "#000");

	if(CONFIG.isChild === true) {
		$.NavigationBar.showBack();
	}

	if(APP.Settings.useSlideMenu) {
		$.NavigationBar.showMenu();
	} else {
		$.NavigationBar.showSettings();
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

	if(APP.Device.isTablet && !SELECTED) {
		SELECTED = data[0].id;

		APP.addChild("flickr_album", {
			id: data[0].id,
			title: data[0].title,
			cache: CONFIG.cache,
			index: CONFIG.index,
			apiKey: CONFIG.apiKey
		});
	}
};

// Event listeners
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
		index: CONFIG.index,
		apiKey: CONFIG.apiKey
	});
});

// Kick off the init
$.init();
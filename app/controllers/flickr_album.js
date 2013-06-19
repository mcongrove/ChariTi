var APP = require("core");
var MODEL = require("models/flickr")();

var CONFIG = arguments[0] || {};
var PHOTOS;

$.init = function() {
	APP.log("debug", "flickr_album.init | " + JSON.stringify(CONFIG));

	MODEL.init(CONFIG.index);
	MODEL.setApiKey(CONFIG.apiKey);

	MODEL.retrieveSet({
		id: CONFIG.id,
		cache: CONFIG.cache,
		callback: $.handleData,
		error: function() {
			alert("Unable to connect. Please try again later.");
		}
	});

	$.NavigationBar.setBackgroundColor(APP.Settings.colors.primary || "#000");

	if(APP.Device.isHandheld) {
		$.NavigationBar.showBack();
	}
};

$.handleData = function() {
	APP.log("debug", "flickr_album.handleData");

	PHOTOS = MODEL.getSet(CONFIG.id);

	$.createGrid(PHOTOS);

	Ti.App.addEventListener("APP:orientationChange", function(_event) {
		var children = $.container.children;

		for(var i = 0, z = children.length; i < z; i++) {
			$.container.remove(children[i]);
		}

		$.createGrid(PHOTOS);
	});
};

$.createGrid = function(_data) {
	var width;

	if(OS_IOS) {
		if(Alloy.isHandheld) {
			width = APP.Device.width;
		} else {
			if(APP.Device.orientation == "PORTRAIT") {
				width = (APP.Device.width - 321);
			} else {
				width = (APP.Device.height - 321);
			}
		}
	} else {
		if(Alloy.isHandheld) {
			width = APP.Device.width;
		} else {
			width = (APP.Device.height - 321);
		}
	}

	var rowLength = Math.floor(width / 80);
	var photosWidth = (77 * rowLength);
	var padding = ((width - photosWidth) / (rowLength - 1));
	var counter = 1;
	var row;

	for(var i = 0, z = _data.length; i < z; i++) {
		if(counter == 1) {
			row = Ti.UI.createView({
				layout: "horizontal",
				top: (i == 0 ? 0 : padding) + "dp",
				height: "77dp"
			});
		}

		var thumbnail = Alloy.createController("flickr_thumb", {
			id: _data[i].id,
			image: _data[i].url_sq,
			left: (counter == 1 ? 0 : padding) + "dp"
		}).getView();

		thumbnail.addEventListener("click", function(_event) {
			APP.log("debug", "flickr_album @click " + _event.source.id);

			APP.addChild("flickr_photo", {
				id: _event.source.id,
				setid: CONFIG.id,
				index: CONFIG.index,
				apiKey: CONFIG.apiKey
			});
		});

		row.add(thumbnail);

		if(counter == rowLength || (i + 1) == z) {
			$.container.add(row);

			counter = 1;
		} else {
			counter++;
		}
	}
};

// Kick off the init
$.init();
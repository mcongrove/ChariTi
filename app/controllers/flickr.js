var APP = require("core");
var MODEL = require("models/flickr");

var CONFIG = arguments[0];

$.init = function() {
	APP.log("debug", "flickr.init | " + JSON.stringify(CONFIG));
	
	APP.openLoading();
	
	$.NavigationBar.Wrapper.backgroundColor = APP.Settings.colors.primary || "#000";
	$.NavigationBar.right.visible			= true;
	$.NavigationBar.rightImage.image		= "/images/settings.png";

	if (CONFIG.isChild === true) {
		$.NavigationBar.back.visible		= true;
	}
	
	MODEL.setApiKey(CONFIG.apiKey);
	
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

$.handleSets = function(_data) {
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
};

// Event listeners
$.NavigationBar.back.addEventListener("click", function(_event) {
	APP.log("debug", "flickr @close");
	
	APP.closeDetailScreen();
});

$.NavigationBar.right.addEventListener("click", function(_event) {
	APP.openSettings();
});

$.content.addEventListener("click", function(_event) {
	APP.log("debug", "flickr @click " + _event.row.id);
	
	APP.openDetailScreen("flickr_album", {
		id: _event.row.id,
		cache: CONFIG.cache,
		title: _event.row.setTitle
	});
});

// Kick off the init
$.init();
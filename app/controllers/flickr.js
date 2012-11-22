var APP = require("core");
var MODEL = require("models/flickr");

var CONFIG = arguments[0];

$.init = function() {
	Ti.API.debug("flickr.init");
	Ti.API.trace(JSON.stringify(CONFIG));
	
	APP.openLoading();
	
	$.NavigationBar.Wrapper.backgroundColor = APP.Settings.colors.primary || "#000";
	
	MODEL.setApiKey(CONFIG.apiKey);
	
	MODEL.generateNsid({
		username: CONFIG.username,
		callback: $.handleNsid
	});
};

$.handleNsid = function() {
	Ti.API.debug("flickr.handleNsid");
	
	MODEL.retrieveSets({
		cache: CONFIG.cache,
		callback: $.handleSets
	});
};

$.handleSets = function(_data) {
	Ti.API.debug("flickr.handleSets");
	
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
$.content.addEventListener("click", function(_event) {
	Ti.API.debug("flickr @click " + _event.row.id);
	
	APP.openDetailScreen("flickr_album", {
		id: _event.row.id,
		cache: CONFIG.cache,
		title: _event.row.setTitle
	});
});

// Kick off the init
$.init();
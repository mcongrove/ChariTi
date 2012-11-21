var APP = require("core");
var MODEL = require("models/flickr");

var DATA = arguments[0] || {};

$.init = function() {
	Ti.API.debug("flickr.init");
	Ti.API.trace(JSON.stringify(DATA));
	
	MODEL.retrieveSet({
		id: DATA.id,
		cache: DATA.cache,
		callback: $.handleData
	});
	
	$.NavigationBar.Wrapper.backgroundColor	= APP.Settings.colors.primary || "#000";
	$.NavigationBar.title.text				= DATA.title;
	$.NavigationBar.title.color				= APP.Settings.colors.text || "#FFF";
	$.NavigationBar.back.visible			= true;
};

$.handleData = function() {
	Ti.API.debug("flickr.handleData");
	
	var data = MODEL.getSet(DATA.id);
	var top = 10;
	var left = -67;
	var counter = 0;
	
	for(var i = 0, x = data.length; i < x; i++) {
		if(counter == 4) {
			counter = 1;
			
			top += 77;
			left = 10;
		} else {
			counter++;
			
			left += 77;
		}
		
		var thumbnail = Alloy.createController("flickr_thumb", {
			id: data[i].id,
			image: data[i].url_sq,
			top: top + "dp",
			left: left + "dp",
			bottom: (i + 1 == x) ? true : false
		}).getView();
		
		$.content.add(thumbnail);
	}
};

// Event listeners
$.NavigationBar.back.addEventListener("click", function(_event) {
	Ti.API.debug("flickr @close");
	
	APP.closeAllDetailScreens();
});

$.content.addEventListener("click", function(_event) {
	Ti.API.debug("flickr @click " + _event.source.id);
	
	APP.openDetailScreen("flickr_photo", {
		id: _event.source.id
	});
});

// Kick off the init
$.init();
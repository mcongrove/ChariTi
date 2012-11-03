var APP = require("core");
var UTIL = require("utilities");
var MODEL = require("models/flickr");

var DATA = arguments[0] || {};

$.init = function() {
	MODEL.retrieveSet({
		id: DATA.id,
		callback: $.handleData
	});
	
	$.NavigationBar.title.text = DATA.title;
};

$.handleData = function() {
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
	APP.closeAllDetailScreens();
});

$.content.addEventListener("click", function(_event) {
	APP.openDetailScreen("flickr_photo", {
		id: _event.source.id
	});
});

// Kick off the init
$.init();
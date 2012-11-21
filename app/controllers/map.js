var APP = require("core");

var CONFIG = arguments[0];

$.init = function() {
	Ti.API.debug("map.init");
	Ti.API.info(JSON.stringify(CONFIG));
	
	$.NavigationBar.Wrapper.backgroundColor = APP.Settings.colors.primary || "#000";
	
	var annotations = [];
	
	for(var i = 0, x = CONFIG.points.length; i < x; i++) {
		var annotation = Ti.Map.createAnnotation({
			latitude: CONFIG.points[i].latitude,
			longitude: CONFIG.points[i].longitude,
			title: CONFIG.points[i].title,
			subtitle: CONFIG.points[i].subTitle,
			pincolor: CONFIG.points[i].pinColor
		});
		
		annotations.push(annotation);
	}
	
	$.content.setAnnotations(annotations);
	
	$.content.setRegion({
		latitude: CONFIG.points[0].latitude,
		longitude: CONFIG.points[0].longitude, 
		latitudeDelta: 0.04,
		longitudeDelta: 0.04
	});
	
	$.content.selectAnnotation(annotations[0]);
};

// Kick off the init
$.init();
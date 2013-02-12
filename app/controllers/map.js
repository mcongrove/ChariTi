var APP = require("core");

var CONFIG = arguments[0];

$.init = function() {
	APP.log("debug", "map.init | " + JSON.stringify(CONFIG));

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

// Kick off the init
$.init();
/**
 * Controller for the map screen
 * 
 * @class Controllers.map
 * @uses core
 */
var APP = require("core");

var CONFIG = arguments[0];

/**
 * Initializes the controller
 */
$.init = function() {
	APP.log("debug", "map.init | " + JSON.stringify(CONFIG));

	var annotations = [];

	for(var i = 0, x = CONFIG.points.length; i < x; i++) {
		var pinColor;

		switch(CONFIG.points[i].pinColor.toUpperCase()) {
			case "PURPLE":
				pinColor = "PURPLE";
				break;
			case "GREEN":
				pinColor = "GREEN";
				break;
			default:
				pinColor = "RED";
				break;
		}

		var annotation = Ti.Map.createAnnotation({
			latitude: CONFIG.points[i].latitude,
			longitude: CONFIG.points[i].longitude,
			title: CONFIG.points[i].title,
			subtitle: CONFIG.points[i].subTitle,
			pincolor: Ti.Map["ANNOTATION_" + pinColor]
		});

		annotations.push(annotation);
	}

	$.container.setAnnotations(annotations);

	$.container.setRegion({
		latitude: CONFIG.points[0].latitude,
		longitude: CONFIG.points[0].longitude,
		latitudeDelta: 0.04,
		longitudeDelta: 0.04
	});

	$.container.selectAnnotation(annotations[0]);

	$.NavigationBar.setBackgroundColor(APP.Settings.colors.primary);

	if(CONFIG.isChild === true) {
		$.NavigationBar.showBack(function(_event) {
			APP.removeChild();
		});
	}

	if(APP.Settings.useSlideMenu) {
		$.NavigationBar.showMenu(function(_event) {
			APP.toggleMenu();
		});
	} else {
		$.NavigationBar.showSettings(function(_event) {
			APP.openSettings();
		});
	}
};

// Kick off the init
$.init();
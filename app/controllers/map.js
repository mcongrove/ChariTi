var CONFIG = arguments[0];

$.init = function() {
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
	
	$.Wrapper.setAnnotations(annotations);
	
	$.Wrapper.setRegion({
		latitude: CONFIG.points[0].latitude,
		longitude: CONFIG.points[0].longitude, 
		latitudeDelta: 0.04,
		longitudeDelta: 0.04
	});
	
	$.Wrapper.selectAnnotation(annotations[0]);
};

// Kick off the init
$.init();
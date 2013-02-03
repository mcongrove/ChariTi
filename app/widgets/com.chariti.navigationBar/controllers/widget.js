var CONFIG = arguments[0] || {};

if(CONFIG.image) {
	var image = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, CONFIG.image);
	
	if(image.exists()) {
		image = image.nativePath;
	} else {
		image = "/data/" + CONFIG.image;
	}
	
	$.title = Ti.UI.createImageView({
		image: image,
		height: "26dp",
		width: Ti.UI.SIZE,
		top: "10dp",
		bottom: "10dp"
	});
} else {
	$.title = Ti.UI.createLabel({
		top: "0dp",
		left: "58dp",
		right: "58dp",
		height: "46dp",
		font: {
			fontSize: "22dp",
			fontWeight: "bold"
		},
		color: "#FFF",
		textAlign: "center",
		shadowColor: "#000",
		shadowOffset: {
			x: "0dp",
			y: "1dp"
		},
		text: CONFIG.text ? CONFIG.text : ""
	});
}

$.Wrapper.add($.title);
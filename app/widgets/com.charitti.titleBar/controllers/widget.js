var CONFIG = arguments[0] || {};

if(CONFIG.text) {
	var title = Ti.UI.createLabel({
		top: "10dp",
		left: "10dp",
		right: "10dp",
		height: "26dp",
		font: {
			fontSize: "22dp",
			fontWeight: "bold"
		},
		color: "#FFF",
		textAlign: "center",
		text: CONFIG.text
	});
} else if(CONFIG.image) {
	var title = Ti.UI.createImageView({
		image: "/data/" + CONFIG.image,
		height: "26dp",
		width: Ti.UI.SIZE,
		top: "10dp",
		bottom: "10dp"
	});
}

$.Wrapper.add(title);
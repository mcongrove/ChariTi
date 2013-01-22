var CONFIG = arguments[0] || {};

if(CONFIG.image) {
	$.title = Ti.UI.createImageView({
		image: "/data/" + CONFIG.image,
		height: "26dp",
		width: Ti.UI.SIZE,
		top: "10dp",
		bottom: "10dp"
	});
} else {
	$.title = Ti.UI.createLabel({
		top: "0dp",
		left: "49dp",
		right: "49dp",
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
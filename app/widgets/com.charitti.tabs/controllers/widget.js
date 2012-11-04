$.tabs = [];
$.width = 0;

$.init = function(_params) {
	$.width = Math.floor(Ti.Platform.displayCaps.platformWidth / _params.tabs.length);
	
	$.Wrapper.backgroundColor	= _params.colors.primary;
	$.indicator.width			= $.width - 6 + "dp";
	$.indicator.backgroundColor	= _params.colors.secondary;
	
	for(var i = 0; i < _params.tabs.length; i++) {
		var tab = Ti.UI.createView({
			id: _params.tabs[i].id,
			width: $.width + "dp"
		});

		var icon = Ti.UI.createImageView({
			image: _params.tabs[i].image,
			width: "32dp",
			height: "32dp",
			top: "7dp",
			touchEnabled: false
		});
		
		var label = Ti.UI.createLabel({
			text: _params.tabs[i].title,
			top: "42dp",
			left: "0dp",
			right: "0dp",
			width: $.width + "dp",
			height: "13dp",
			font: {
				fontSize: "11dp",
				fontWeight: "bold"
			},
			color: _params.colors.text,
			textAlign: "center",
			touchEnabled: false
		});

		tab.add(icon);
		tab.add(label);
		
		$.tabs.push(tab);
		
		$.TabContainer.add(tab);
	}
};

$.setIndex = function(_index) {
	var animation = Ti.UI.createAnimation({
		left: (_index * $.width) + 3 + "dp",
		duration: 250
	});
	
	animation.addEventListener("complete", function(_event) {
		$.indicator.left = (_index * $.width) + 3 + "dp";
	});
	
	$.indicator.animate(animation);
};

$.Wrapper.addEventListener("click", function(_event) {
	$.setIndex(_event.source.id);
});
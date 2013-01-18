$.tabs = [];
$.width = 0;

$.init = function(_params) {
	$.width	= (Ti.Platform.displayCaps.platformWidth / _params.tabs.length);
	
	$.Wrapper.backgroundColor	= _params.colors.primary;
	$.indicator.width			= $.width + "dp";
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
			top: "43dp",
			left: "5dp",
			right: "5dp",
			width: Ti.UI.FILL,
			height: "13dp",
			font: {
				fontSize: "11dp",
				fontWeight: "bold"
			},
			shadowColor: "#000",
			shadowOffset: {
				x: "0dp",
				y: "1dp"
			},
			color: _params.colors.text,
			textAlign: "center",
			touchEnabled: false
		});

		tab.add(icon);
		tab.add(label);
		
		if((i + 1) != _params.tabs.length) {
			var border = Ti.UI.createImageView({
				width: "1dp",
				height: "59dp",
				top: "1dp",
				right: "0dp",
				backgroundImage: "/com.chariti.tabs/border.png"
			});
			
			tab.add(border);
		}
		
		$.tabs.push(tab);
		
		$.TabContainer.add(tab);
	}
};

$.clear = function() {
	for(var i = 0; i < $.tabs.length; i++) {
		$.TabContainer.remove($.tabs[i]);
	}
};

$.setIndex = function(_index) {
	$.indicator.left	= (_index * $.width) + "dp";
	$.indicator.width	= $.width + "dp";
};

$.Wrapper.addEventListener("click", function(_event) {
	$.setIndex(_event.source.id);
});
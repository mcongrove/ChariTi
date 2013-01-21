var Alloy		= require("alloy");

$.tabs			= [];
$.excess		= false;
$.excessLength	= 5;
$.moreOpen		= false;
$.width			= 0;

$.init = function(_params) {
	if(Alloy.isTablet) {
		$.excessLength = Math.floor(Ti.Platform.displayCaps.platformWidth / 70);
	}
	
	if(_params.tabs.length > $.excessLength) {
		$.excess = true;
	}
	
	$.width	= $.excess ? (Ti.Platform.displayCaps.platformWidth / $.excessLength) : (Ti.Platform.displayCaps.platformWidth / _params.tabs.length);
	
	$.TabGroup.backgroundColor			= _params.colors.primary;
	$.TabContainerMore.backgroundColor	= _params.colors.primary;
	$.Indicator.backgroundColor			= _params.colors.secondary;
	$.IndicatorMore.backgroundColor		= _params.colors.secondary;
	
	$.IndicatorContainer.width		= Ti.Platform.displayCaps.platformWidth + "dp";
	$.Indicator.width				= ($.width - 1) + "dp";
	$.IndicatorMore.width			= $.width + "dp";
	$.TabContainer.width			= Ti.Platform.displayCaps.platformWidth + "dp";
	$.TabGroupMore.width			= Ti.Platform.displayCaps.platformWidth + "dp";
	$.TabContainerMore.width		= ($.width + 1) + "dp";
	
	for(var i = 0; i < _params.tabs.length; i++) {
		if($.excess && i == ($.excessLength - 1)) {
			$.addMoreTab(_params);
		}
		
		var tab = Ti.UI.createView({
			id: _params.tabs[i].id,
			width: $.width + "dp",
			height: "60dp",
			top: "0dp",
			left: "0dp"
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
		
		if($.excess && i > ($.excessLength - 2)) {
			tab.backgroundImage = "/com.chariti.tabs/overlay.png";
			tab.width	= ($.width + 1) + "dp";
			label.left	= "6dp";
			
			var border = Ti.UI.createImageView({
				width: "1dp",
				height: "59dp",
				top: "1dp",
				left: "0dp",
				backgroundImage: "/com.chariti.tabs/border.png"
			});
			
			tab.add(border);
			
			$.tabs.push(tab);
			
			$.TabsMore.add(tab);
		} else {
			if((i + 1) < _params.tabs.length) {
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
		}
	}
	
	for(var i = 0, z = $.tabs.length; i < z; i++) {
		$.Tabs.add($.tabs[i]);
	}
};

$.addMoreTab = function(_params) {
	var tab = Ti.UI.createView({
		width: $.width + "dp"
	});

	var icon = Ti.UI.createImageView({
		image: "/icons/more.png",
		width: "32dp",
		height: "32dp",
		top: "7dp",
		touchEnabled: false
	});
	
	var label = Ti.UI.createLabel({
		text: "More",
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
	
	tab.addEventListener("click", $.moreEvent);
	
	$.tabs.push(tab);
};

$.clear = function() {
	for(var i = 0; i < $.tabs.length; i++) {
		$.Tabs.remove($.tabs[i]);
	}
};

$.setIndex = function(_index) {
	if($.excess && _index > ($.excessLength - 2)) {
		_moreIndex	= _index - ($.excessLength - 1);
		_index		= ($.excessLength - 1);
		
		$.IndicatorMore.visible = true;
		$.IndicatorMore.top		= ((_moreIndex * 60)) + "dp";
	} else {
		$.IndicatorMore.visible = false;
	}
	
	$.Indicator.left	= (_index * $.width) + "dp";
	$.Indicator.width	= $.width + "dp";
	
	$.moreClose();
};

$.moreEvent = function(_event) {
	 if($.moreOpen) {
	 	$.Wrapper.height = "60dp";
	 	
	 	$.moreOpen = false;
	 } else {
	 	$.moreOpen = true;
	 	
	 	$.Wrapper.height = Ti.UI.SIZE;
	 }
};

$.moreClose = function() {
	$.Wrapper.height	= "60dp";
	$.moreOpen			= false;
};

$.Wrapper.addEventListener("click", function(_event) {
	if(typeof _event.source.id !== "undefined" && typeof _event.source.id == "number") {
		$.setIndex(_event.source.id);
	}
});
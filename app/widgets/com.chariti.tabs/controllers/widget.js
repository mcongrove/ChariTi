$.init = function(_params) {
	$.tabs			= [];
	$.excess		= false;
	$.excessLength	= 5;
	$.moreOpen		= false;
	$.width			= 0;
	$.display		= {
		width:	Ti.Platform.displayCaps.platformWidth > Ti.Platform.displayCaps.platformHeight ? Ti.Platform.displayCaps.platformHeight : Ti.Platform.displayCaps.platformWidth,
		height:	Ti.Platform.displayCaps.platformWidth > Ti.Platform.displayCaps.platformHeight ? Ti.Platform.displayCaps.platformWidth : Ti.Platform.displayCaps.platformHeight,
		dpi:	Ti.Platform.displayCaps.dpi
	};
	
	if(OS_ANDROID) {
		$.display.width		= ($.display.width / ($.display.dpi / 160));
		$.display.height	= ($.display.height / ($.display.dpi / 160));
	}
	
	if(Alloy.isTablet) {
		$.excessLength = Math.floor($.display.width / 70);
	}
	
	if(_params.tabs.length > $.excessLength) {
		$.excess = true;
	}
	
	$.width	= $.excess ? Math.floor($.display.width / $.excessLength) : Math.floor($.display.width / _params.tabs.length);
	
	$.TabGroup.backgroundColor			= _params.colors.primary;
	$.TabContainerMore.backgroundColor	= _params.colors.primary;
	$.Indicator.backgroundColor			= _params.colors.secondary;
	$.IndicatorMore.backgroundColor		= _params.colors.secondary;
	
	$.IndicatorContainer.width		= $.display.width + "dp";
	$.Indicator.width				= $.width + "dp";
	$.IndicatorMore.width			= $.width + "dp";
	$.TabContainer.width			= $.display.width + "dp";
	$.TabGroupMore.width			= $.display.width + "dp";
	$.TabContainerMore.width		= $.width + "dp";
	
	for(var i = 0; i < _params.tabs.length; i++) {
		if($.excess && i == ($.excessLength - 1)) {
			$.addMoreTab(_params);
		}
		
		var tab = Ti.UI.createView({
			id: _params.tabs[i].id,
			width: $.width + "dp",
			height: "60dp",
			bottom: "0dp",
			left: "0dp"
		});

		var icon = Ti.UI.createImageView({
			image: _params.tabs[i].image,
			width: "32dp",
			height: "32dp",
			top: "7dp",
			touchEnabled: false,
			preventDefaultImage: true
		});
		
		var label = Ti.UI.createLabel({
			text: _params.tabs[i].title,
			top: "42dp",
			left: "5dp",
			right: "5dp",
			width: Ti.UI.FILL,
			height: "15dp",
			font: {
				fontSize: "10dp",
				fontFamily: "HelveticaNeue"
			},
			color: _params.colors.text,
			textAlign: "center",
			touchEnabled: false
		});

		tab.add(icon);
		tab.add(label);
		
		if($.excess && i >= ($.excessLength - 1)) {
			tab.width	= $.width + "dp";
			label.left	= "5dp";
			
			$.tabs.push(tab);
			
			$.TabsMore.add(tab);
		} else {
			$.tabs.push(tab);
		}
	}
	
	for(var i = 0, z = $.excessLength; i < z; i++) {
		if($.tabs[i]) {
			$.Tabs.add($.tabs[i]);
		}
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
		touchEnabled: false,
		preventDefaultImage: true
	});
	
	var label = Ti.UI.createLabel({
		text: "More",
		top: "43dp",
		left: "5dp",
		right: "5dp",
		width: Ti.UI.FILL,
		height: "13dp",
		font: {
			fontSize: "10dp",
			fontFamily: "HelveticaNeue"
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
	var children		= $.Tabs.children;
	var childrenMore	= $.TabsMore.children;
	
	for(var i = 0; i < children.length; i++) {
		$.Tabs.remove(children[i]);
	}
	
	for(var i = 0; i < childrenMore.length; i++) {
		$.TabsMore.remove(childrenMore[i]);
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
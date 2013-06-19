$.init = function(_params) {
	$.tabs = [];
	
	for(var i = 0; i < _params.tabs.length; i++) {
		var tab = Ti.UI.createTableViewRow({
			id: _params.tabs[i].id,
			height: "47dp",
			backgroundcolor: "#000",
			backgroundSelectedColor: "#EEE",
			selectedBackgroundColor: "#EEE"
		});
		
		var iconWrapper = Ti.UI.createView({
			width: "28dp",
			height: "28dp",
			top: "9dp",
			left: "7dp",
			touchEnabled: false
		});

		var icon = Ti.UI.createImageView({
			image: _params.tabs[i].image,
			width: Ti.UI.SIZE,
			height: "28dp",
			top: 0,
			touchEnabled: false,
			preventDefaultImage: true
		});
		
		var label = Ti.UI.createLabel({
			text: _params.tabs[i].title,
			top: "0dp",
			left: "47dp",
			right: "7dp",
			height: "47dp",
			font: {
				fontSize: "18dp",
				fontFamily: "HelveticaNeue-Light"
			},
			color: "#000",
			touchEnabled: false
		});
		
		iconWrapper.add(icon);
		tab.add(iconWrapper);
		tab.add(label);
		
		$.tabs.push(tab);
	}
	
	$.Tabs.setData($.tabs);
	
	$.createSettings();
};

$.createSettings = function() {
	var tab = Ti.UI.createTableViewRow({
		id: "settings",
		height: "47dp",
		backgroundcolor: "#000",
		backgroundSelectedColor: "#EEE",
		selectedBackgroundColor: "#EEE"
	});
	
	var icon = Ti.UI.createImageView({
		image: WPATH("images/settings.png"),
		width: "28dp",
		height: "28dp",
		top: "9dp",
		left: "7dp",
		touchEnabled: false,
		preventDefaultImage: true
	});
	
	var label = Ti.UI.createLabel({
		text: "Settings",
		top: "0dp",
		left: "47dp",
		right: "7dp",
		height: "47dp",
		font: {
			fontSize: "18dp",
			fontFamily: "HelveticaNeue-Light"
		},
		color: "#000",
		touchEnabled: false
	});
	
	tab.add(icon);
	tab.add(label);
	
	$.Tabs.appendRow(tab);
};

$.clear = function() {
	$.Tabs.setData([]);
};

$.setIndex = function(_index) {
	$.Tabs.selectRow(_index);
};

$.Tabs.addEventListener("click", function(_event) {
	if(typeof _event.index !== "undefined") {
		$.setIndex(_event.index);
	}
});
var APP = require("core");

$.init = function(_params) {
	$.tabs = [];
	
	// Add the Settings tab
	_params.tabs.push({
		id: "settings",
		image: WPATH("images/settings.png"),
		title: "Settings"
	});
	
	for(var i = 0; i < _params.tabs.length; i++) {
		var tab = Ti.UI.createTableViewRow({
			id: _params.tabs[i].id,
			height: "47dp",
			backgroundcolor: "#111",
			backgroundSelectedColor: "#222",
			selectedBackgroundColor: "#222"
		});
		
		var label = Ti.UI.createLabel({
			text: _params.tabs[i].title,
			top: "0dp",
			left: "47dp",
			right: "13dp",
			height: "47dp",
			font: {
				fontSize: "16dp",
				fontFamily: "HelveticaNeue-Light"
			},
			color: "#FFF",
			touchEnabled: false
		});
		
		if(_params.tabs[i].image) {
			var icon = Ti.UI.createImageView({
				image: _params.tabs[i].image,
				width: "21dp",
				height: "21dp",
				top: "13dp",
				left: "13dp",
				touchEnabled: false,
				preventDefaultImage: true
			});
			
			tab.add(icon);
		}
		
		tab.add(label);
		
		$.tabs.push(tab);
	}
	
	$.Tabs.setData($.tabs);
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

// Move the UI down if iOS7+
if(OS_IOS && APP.Device.versionMajor >= 7) {
	$.Tabs.top = "20dp";
}
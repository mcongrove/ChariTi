$.tabs = [];
$.width = 0;

$.init = function(_tabs, _callback) {
	$.width = Math.floor(Ti.Platform.displayCaps.platformWidth / _tabs.length);
	$.indicator.width = $.width;
	
	for(var i = 0; i < _tabs.length; i++) {
		var tab = Ti.UI.createView({
			id: _tabs[i].id,
			width: $.width + "dp"
		});

		var icon = Ti.UI.createImageView({
			image: _tabs[i].image,
			width: "30dp",
			height: "30dp",
			top: "10dp",
			touchEnabled: false
		});

		tab.add(icon);
		
		$.tabs.push(tab);
		
		$.TabContainer.add(tab);
	}
};

$.setIndex = function(_index) {
	var animation = Ti.UI.createAnimation({
		left: (_index * $.width) + "dp",
		duration: 250
	});
	
	animation.addEventListener("complete", function(_event) {
		$.indicator.left = (_index * $.width) + "dp";
	});
	
	$.indicator.animate(animation);
};

$.Wrapper.addEventListener("click", function(_event) {
	$.setIndex(_event.source.id);
});
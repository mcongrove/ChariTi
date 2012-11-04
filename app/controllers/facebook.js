var APP = require("core");
var UTIL = require("utilities");
var MODEL = require("models/facebook");

var CONFIG = arguments[0];

$.init = function() {
	MODEL.fetch({
		url: CONFIG.feed,
		callback: function() {
			$.handleData(MODEL.getAllArticles());
		}
	});
};

$.handleData = function(_data) {
	var rows = [];
	
	for(var i = 0, x = _data.length; i < x; i++) {
		var row = Alloy.createController("facebook_row", {
			id: _data[i].id,
			heading: _data[i].title,
			subHeading: UTIL.toDateRelative(_data[i].date)
		}).getView();
		
		rows.push(row);
	}
	
	$.Wrapper.setData(rows);
};

// Event listeners
$.Wrapper.addEventListener("click", function(_event) {
	APP.openDetailScreen("facebook_article", {
		id: _event.row.id
	});
});

// Kick off the init
$.init();
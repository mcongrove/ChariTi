var APP = require("core");
var UTIL = require("utilities");
var MODEL = require("models/blog");

var CONFIG = arguments[0];

$.init = function() {
	Ti.API.debug("blog.init");
	Ti.API.trace(JSON.stringify(CONFIG));
	
	$.TitleBar.Wrapper.backgroundColor = APP.Settings.colors.primary || "#000";
	
	MODEL.fetch({
		url: CONFIG.feed,
		callback: function() {
			$.handleData(MODEL.getAllArticles());
		}
	});
};

$.handleData = function(_data) {
	Ti.API.debug("blog.handleData");
	
	var rows = [];
	
	for(var i = 0, x = _data.length; i < x; i++) {
		var row = Alloy.createController("blog_row", {
			id: _data[i].id,
			heading: _data[i].title,
			subHeading: UTIL.toDateRelative(_data[i].date)
		}).getView();
		
		rows.push(row);
	}
	
	$.content.setData(rows);
};

// Event listeners
$.content.addEventListener("click", function(_event) {
	Ti.API.debug("blog @click " + _event.row.id);
	
	APP.openDetailScreen("blog_article", {
		id: _event.row.id
	});
});

// Kick off the init
$.init();
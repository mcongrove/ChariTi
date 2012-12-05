var APP = require("core");
var UTIL = require("utilities");
var MODEL = require("models/blog");

var CONFIG = arguments[0];

$.init = function() {
	APP.log("debug", "blog.init | " + JSON.stringify(CONFIG));
	
	APP.openLoading();
	
	$.NavigationBar.Wrapper.backgroundColor = APP.Settings.colors.primary || "#000";
	$.NavigationBar.right.visible			= true;
	$.NavigationBar.rightImage.image		= "/images/settings.png";
	
	MODEL.fetch({
		url: CONFIG.feed,
		cache: CONFIG.cache,
		callback: function() {
			$.handleData(MODEL.getAllArticles());
		}
	});
};

$.handleData = function(_data) {
	APP.log("debug", "blog.handleData");
	
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
	
	APP.closeLoading();
};

// Event listeners
$.NavigationBar.right.addEventListener("click", function(_event) {
	APP.openSettings();
});

$.content.addEventListener("click", function(_event) {
	APP.log("debug", "blog @click " + _event.row.id);
	
	APP.openDetailScreen("blog_article", {
		id: _event.row.id
	});
});

// Kick off the init
$.init();
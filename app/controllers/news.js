var APP = require("core");
var UTIL = require("utilities");
var MODEL = require("models/news");

var CONFIG = arguments[0];

$.init = function() {
	Ti.API.debug("news.init");
	Ti.API.info(JSON.stringify(CONFIG));
	
	APP.openLoading();
	
	$.NavigationBar.Wrapper.backgroundColor = APP.Settings.colors.primary || "#000";
	
	MODEL.fetch({
		url: CONFIG.feed,
		cache: CONFIG.cache,
		callback: function() {
			$.handleData(MODEL.getAllArticles());
		}
	});
};

$.handleData = function(_data) {
	Ti.API.debug("news.handleData");
	
	var rows = [];
	
	for(var i = 0, x = _data.length; i < x; i++) {
		var row = Alloy.createController("news_row", {
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
$.content.addEventListener("click", function(_event) {
	Ti.API.debug("news @click " + _event.row.id);
	
	APP.openDetailScreen("news_article", {
		id: _event.row.id
	});
});

// Kick off the init
$.init();
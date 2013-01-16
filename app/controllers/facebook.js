var APP = require("core");
var UTIL = require("utilities");
var MODEL = require("models/facebook");

var CONFIG = arguments[0];

$.init = function() {
	APP.log("debug", "facebook.init | " + JSON.stringify(CONFIG));
	
	APP.openLoading();
	
	$.NavigationBar.Wrapper.backgroundColor = APP.Settings.colors.primary || "#000";
	$.NavigationBar.right.visible			= true;
	$.NavigationBar.rightImage.image		= "/images/settings.png";

	if (CONFIG.isChild === true) {
		$.NavigationBar.back.visible		= true;
	}
	
	MODEL.fetch({
		url: "http://www.facebook.com/feeds/page.php?format=rss20&id=" + CONFIG.userid,
		cache: CONFIG.cache,
		callback: function() {
			$.handleData(MODEL.getAllArticles());
		}
	});
};

$.handleData = function(_data) {
	APP.log("debug", "facebook.handleData");
	
	var rows = [];
	
	for(var i = 0, x = _data.length; i < x; i++) {
		var row = Alloy.createController("facebook_row", {
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
$.NavigationBar.back.addEventListener("click", function(_event) {
	APP.log("debug", "facebook @close");
	
	APP.closeDetailScreen();
});

$.NavigationBar.right.addEventListener("click", function(_event) {
	APP.openSettings();
});

$.content.addEventListener("click", function(_event) {
	APP.log("debug", "facebook @click " + _event.row.id);
	
	APP.openDetailScreen("facebook_article", {
		id: _event.row.id
	});
});

// Kick off the init
$.init();
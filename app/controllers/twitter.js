var APP = require("core");
var UTIL = require("utilities");
var MODEL = require("models/twitter");

var CONFIG = arguments[0];

$.init = function() {
	APP.log("debug", "twitter.init | " + JSON.stringify(CONFIG));
	
	APP.openLoading();
	
	$.NavigationBar.Wrapper.backgroundColor = APP.Settings.colors.primary || "#000";
	$.NavigationBar.right.visible			= true;
	$.NavigationBar.rightImage.image		= "/images/settings.png";

	if (CONFIG.isChild === true) {
		$.NavigationBar.back.visible		= true;
	}
	
	MODEL.fetch({
		url: "https://api.twitter.com/1/statuses/user_timeline.json?trim_user=true&include_rts=false&exclude_replies=true&count=50&screen_name=" + CONFIG.username,
		cache: CONFIG.cache,
		callback: function() {
			$.handleData(MODEL.getTweets());
		}
	});
};

$.handleData = function(_data) {
	APP.log("debug", "twitter.handleData");
	
	var rows = [];
	
	for(var i = 0, x = _data.length; i < x; i++) {
		var row = Alloy.createController("twitter_row", {
			id: _data[i].id,
			heading: _data[i].text,
			subHeading: UTIL.toDateRelative(_data[i].date),
			username: CONFIG.username
		}).getView();
		
		rows.push(row);
	}
	
	$.content.setData(rows);
	
	APP.closeLoading();
};

// Event listeners

$.NavigationBar.back.addEventListener("click", function(_event) {
	APP.log("debug", "twitter @close");
	
	APP.closeDetailScreen();
});

$.NavigationBar.right.addEventListener("click", function(_event) {
	APP.openSettings();
});

// Kick off the init
$.init();
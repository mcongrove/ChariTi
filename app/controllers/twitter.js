var APP = require("core");
var UTIL = require("utilities");
var MODEL = require("models/twitter");

var CONFIG = arguments[0];

$.init = function() {
	Ti.API.debug("twitter.init");
	Ti.API.trace(JSON.stringify(CONFIG));
	
	APP.openLoading();
	
	$.NavigationBar.Wrapper.backgroundColor = APP.Settings.colors.primary || "#000";
	
	MODEL.fetch({
		url: "https://api.twitter.com/1/statuses/user_timeline.json?trim_user=true&include_rts=false&exclude_replies=true&count=50&screen_name=" + CONFIG.username,
		cache: CONFIG.cache,
		callback: function() {
			$.handleData(MODEL.getTweets());
		}
	});
};

$.handleData = function(_data) {
	Ti.API.debug("twitter.handleData");
	
	var rows = [];
	
	for(var i = 0, x = _data.length; i < x; i++) {
		var row = Alloy.createController("twitter_row", {
			id: _data[i].id,
			heading: _data[i].text,
			subHeading: UTIL.toDateRelative(_data[i].date)
		}).getView();
		
		rows.push(row);
	}
	
	$.content.setData(rows);
	
	APP.closeLoading();
};

// Kick off the init
$.init();
var APP = require("core");
var UTIL = require("utilities");
var MODEL = require("models/twitter");
var DATE = require("alloy/moment");
var STRING = require("alloy/string");

var CONFIG = arguments[0];

var offset = 0;
var refreshLoading = false;
var refreshEngaged = false;

$.init = function() {
	APP.log("debug", "twitter.init | " + JSON.stringify(CONFIG));

	CONFIG.feed = "https://api.twitter.com/1/statuses/user_timeline.json?trim_user=true&include_rts=false&exclude_replies=true&count=50&screen_name=" + CONFIG.username;

	APP.openLoading();

	$.retrieveData();

	$.NavigationBar.Wrapper.backgroundColor = APP.Settings.colors.primary || "#000";
	$.NavigationBar.right.visible = true;
	$.NavigationBar.rightImage.image = "/images/settings.png";

	if(CONFIG.isChild === true) {
		$.NavigationBar.back.visible = true;
	}

	if(!OS_IOS) {
		$.NavigationBar.left.visible = true;
		$.NavigationBar.leftImage.image = "/images/refresh.png";
	}
};

$.retrieveData = function(_force, _callback) {
	MODEL.fetch({
		url: CONFIG.feed,
		cache: _force ? 0 : CONFIG.cache,
		callback: function() {
			$.handleData(MODEL.getTweets());

			if(typeof _callback !== "undefined") {
				_callback();
			}
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
			subHeading: STRING.ucfirst(DATE(parseInt(_data[i].date)).fromNow()),
			username: CONFIG.username
		}).getView();

		rows.push(row);
	}

	$.container.setData(rows);

	APP.closeLoading();
};

// Event listeners
$.Wrapper.addEventListener("APP:screenAdded", function() {
	$.retrieveData();
});

$.NavigationBar.back.addEventListener("click", function(_event) {
	APP.log("debug", "twitter @close");

	APP.removeChild();
});

$.NavigationBar.right.addEventListener("click", function(_event) {
	APP.openSettings();
});

if(OS_IOS) {
	var pullToRefresh = Alloy.createWidget("nl.fokkezb.pullToRefresh", null, {
		table: $.container,
		backgroundColor: "#EEE",
		fontColor: "#AAA",
		indicator: "dark",
		image: "/images/ptrArrow.png",
		loader: function(_callback) {
			$.retrieveData(true, function() {
				_callback(true);
			});
		}
	});

	pullToRefresh.date(DATE(parseInt(UTIL.lastUpdate(CONFIG.feed))).toDate());
} else {
	$.NavigationBar.left.addEventListener("click", function(_event) {
		$.retrieveData(true);
	});
}

// Kick off the init
$.init();
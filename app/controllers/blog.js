var APP = require("core");
var UTIL = require("utilities");
var MODEL = require("models/blog");
var DATE = require("alloy/moment");
var STRING = require("alloy/string");

var CONFIG = arguments[0];
var SELECTED;

var offset = 0;
var refreshLoading = false;
var refreshEngaged = false;

$.init = function() {
	APP.log("debug", "blog.init | " + JSON.stringify(CONFIG));

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
			$.handleData(MODEL.getAllArticles());

			if(typeof _callback !== "undefined") {
				_callback();
			}
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
			subHeading: STRING.ucfirst(DATE(parseInt(_data[i].date)).fromNow())
		}).getView();

		rows.push(row);
	}

	$.container.setData(rows);

	APP.closeLoading();

	if(APP.Device.isTablet) {
		SELECTED = _data[0].id;

		APP.addChild("blog_article", {
			id: _data[0].id
		});
	}
};

// Event listeners
$.Wrapper.addEventListener("APP:screenAdded", function(_event) {
	$.retrieveData();
});

$.NavigationBar.back.addEventListener("click", function(_event) {
	APP.log("debug", "blog @close");

	APP.removeChild();
});

$.NavigationBar.right.addEventListener("click", function(_event) {
	APP.openSettings();
});

$.container.addEventListener("click", function(_event) {
	APP.log("debug", "blog @click " + _event.row.id);

	if(APP.Device.isTablet) {
		if(_event.row.id == SELECTED) {
			return;
		} else {
			SELECTED = _event.row.id;
		}
	}

	APP.addChild("blog_article", {
		id: _event.row.id
	});
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
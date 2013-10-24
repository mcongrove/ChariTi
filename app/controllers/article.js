/**
 * Controller for the article list screen
 * 
 * @class Controllers.article
 * @uses Models.article
 * @uses core
 * @uses utilities
 */
var APP = require("core");
var UTIL = require("utilities");
var DATE = require("alloy/moment");
var STRING = require("alloy/string");
var MODEL = require("models/article")();

var CONFIG = arguments[0];
var SELECTED;

var offset = 0;
var refreshLoading = false;
var refreshEngaged = false;

$.init = function() {
	APP.log("debug", "article.init | " + JSON.stringify(CONFIG));

	MODEL.init(CONFIG.index);

	APP.openLoading();

	$.NavigationBar.setBackgroundColor(APP.Settings.colors.primary || "#000");

	if(CONFIG.isChild === true) {
		$.NavigationBar.showBack();
	}

	if(APP.Settings.useSlideMenu) {
		$.NavigationBar.showMenu();
	} else {
		$.NavigationBar.showSettings();
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
		},
		error: function() {
			alert("Unable to connect. Please try again later.");

			APP.closeLoading();

			if(typeof _callback !== "undefined") {
				_callback();
			}
		}
	});
};

$.handleData = function(_data) {
	APP.log("debug", "article.handleData");

	var rows = [];

	for(var i = 0, x = _data.length; i < x; i++) {
		var time = DATE(parseInt(_data[i].date, 10));
		time = time.isBefore() ? time : DATE();

		var row = Alloy.createController("article_row", {
			id: _data[i].id,
			heading: _data[i].title,
			subHeading: STRING.ucfirst(time.fromNow())
		}).getView();

		rows.push(row);
	}

	$.container.setData(rows);

	APP.closeLoading();

	if(APP.Device.isTablet && !SELECTED) {
		SELECTED = _data[0].id;

		APP.addChild("article_article", {
			id: _data[0].id,
			index: CONFIG.index
		});
	}
};

// Event listeners
$.Wrapper.addEventListener("APP:screenAdded", function(_event) {
	$.retrieveData();
});

$.container.addEventListener("click", function(_event) {
	APP.log("debug", "article @click " + _event.row.id);

	if(APP.Device.isTablet) {
		if(_event.row.id == SELECTED) {
			return;
		} else {
			SELECTED = _event.row.id;
		}
	}

	APP.addChild("article_article", {
		id: _event.row.id,
		index: CONFIG.index
	});
});

// Pull to Refresh
function ptrRelease(_event) {
	$.retrieveData(true, function() {
		_event.hide();
	});
}

// Kick off the init
$.init();
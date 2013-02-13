var APP = require("core");
var SOCIAL = require("social");
var DATE = require("alloy/moment");
var STRING = require("alloy/string");
var MODEL = require("models/facebook")();

var CONFIG = arguments[0] || {};
var ACTION = {};

$.init = function() {
	APP.log("debug", "facebook_article.init | " + JSON.stringify(CONFIG));

	MODEL.init(CONFIG.index);

	$.handleData(MODEL.getArticle(CONFIG.id));
};

$.handleData = function(_data) {
	APP.log("debug", "facebook_article.handleData");

	$.handleNavigation();

	$.heading.text = _data.title;
	$.text.value = _data.description;
	$.date.text = STRING.ucfirst(DATE(parseInt(_data.date)).fromNow());
	$.date.color = APP.Settings.colors.primary;

	ACTION.url = _data.link

	$.NavigationBar.setBackgroundColor(APP.Settings.colors.primary || "#000");

	if(APP.Device.isHandheld) {
		$.NavigationBar.showBack({
			callback: function(_event) {
				APP.removeAllChildren();
			}
		});
	}

	$.NavigationBar.showAction({
		callback: function(_event) {
			SOCIAL.share(ACTION.url, $.NavigationBar.right);
		}
	});
};

$.handleNavigation = function() {
	ACTION.next = MODEL.getNextArticle(CONFIG.id);
	ACTION.previous = MODEL.getPreviousArticle(CONFIG.id);

	var navigation = Alloy.createWidget("com.chariti.detailNavigation", null, {
		down: function(_event) {
			APP.log("debug", "facebook_article @next");

			APP.addChild("facebook_article", {
				id: ACTION.next.id,
				index: CONFIG.index
			});
		},
		up: function(_event) {
			APP.log("debug", "facebook_article @previous");

			APP.addChild("facebook_article", {
				id: ACTION.previous.id,
				index: CONFIG.index
			});
		}
	}).getView();

	$.NavigationBar.addNavigation(navigation);
};

// Kick off the init
$.init();
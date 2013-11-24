/**
 * Controller for the Facebook post node screen
 * 
 * @class Controllers.facebook.article
 * @uses Models.facebook
 * @uses core
 * @uses social
 * @uses Widgets.com.mcongrove.detailNavigation
 */
var APP = require("core");
var SOCIAL = require("social");
var DATE = require("alloy/moment");
var STRING = require("alloy/string");
var MODEL = require("models/facebook")();

var CONFIG = arguments[0] || {};
var ACTION = {};

/**
 * Initializes the controller
 */
$.init = function() {
	APP.log("debug", "facebook_article.init | " + JSON.stringify(CONFIG));

	MODEL.init(CONFIG.index);

	$.handleData(MODEL.getArticle(CONFIG.id));
};

/**
 * Handles the data return
 * @param {Object} _data The returned data
 */
$.handleData = function(_data) {
	APP.log("debug", "facebook_article.handleData");

	$.handleNavigation();

	var time = DATE(parseInt(_data.date, 10));
	time = time.isBefore() ? time : DATE();

	$.heading.text = _data.title;
	$.heading.color = APP.Settings.colors.hsb.primary.b > 70 ? "#000" : APP.Settings.colors.primary;
	$.text.value = _data.description;
	$.date.text = STRING.ucfirst(time.fromNow());

	ACTION.url = _data.link;

	$.NavigationBar.setBackgroundColor(APP.Settings.colors.primary);

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

/**
 * Handles detail navigation
 */
$.handleNavigation = function() {
	ACTION.next = MODEL.getNextArticle(CONFIG.id);
	ACTION.previous = MODEL.getPreviousArticle(CONFIG.id);

	var navigation = Alloy.createWidget("com.mcongrove.detailNavigation", null, {
		color: APP.Settings.colors.theme == "dark" ? "white" : "black",
		down: function(_event) {
			APP.log("debug", "facebook_article @next");

			APP.addChild("facebook_article", {
				id: ACTION.next.id,
				index: CONFIG.index
			}, false, true);
		},
		up: function(_event) {
			APP.log("debug", "facebook_article @previous");

			APP.addChild("facebook_article", {
				id: ACTION.previous.id,
				index: CONFIG.index
			}, false, true);
		}
	}).getView();

	$.NavigationBar.addNavigation(navigation);
};

// Kick off the init
$.init();
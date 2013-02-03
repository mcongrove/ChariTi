var APP = require("core");
var SOCIAL = require("social");
var DATE = require("alloy/moment");
var STRING = require("alloy/string");

var MODEL = (function() {
	var Model = require("models/facebook");

	return new Model();
})();

var DATA = arguments[0] || {};
var ACTION = {};

$.init = function() {
	APP.log("debug", "facebook_article.init | " + JSON.stringify(DATA));

	MODEL.init(DATA.index);

	$.handleData(MODEL.getArticle(DATA.id));
};

$.handleData = function(_data) {
	APP.log("debug", "facebook_article.handleData");

	$.handleNavigation();

	$.heading.text = _data.title;
	$.text.value = _data.description;
	$.date.text = STRING.ucfirst(DATE(parseInt(_data.date)).fromNow());
	$.date.color = APP.Settings.colors.primary;

	ACTION.url = _data.link

	$.NavigationBar.Wrapper.backgroundColor = APP.Settings.colors.primary || "#000";
	$.NavigationBar.back.visible = APP.Device.isHandheld;
	$.NavigationBar.right.visible = true;
	$.NavigationBar.rightImage.image = "/images/action.png";
};

$.handleNavigation = function() {
	ACTION.next = MODEL.getNextArticle(DATA.id);
	ACTION.previous = MODEL.getPreviousArticle(DATA.id);

	var navigation = Alloy.createWidget("com.chariti.detailNavigation", null, {
		down: function(_event) {
			APP.log("debug", "facebook_article @next");

			APP.addChild("facebook_article", {
				id: ACTION.next.id,
				index: DATA.index
			});
		},
		up: function(_event) {
			APP.log("debug", "facebook_article @previous");

			APP.addChild("facebook_article", {
				id: ACTION.previous.id,
				index: DATA.index
			});
		}
	}).getView();

	$.NavigationBar.Wrapper.add(navigation);
};

// Event listeners
$.NavigationBar.back.addEventListener("click", function(_event) {
	APP.log("debug", "facebook_article @close");

	APP.removeAllChildren();
});

$.NavigationBar.right.addEventListener("click", function(_event) {
	APP.log("debug", "facebook_article @menu");

	SOCIAL.share(ACTION.url, $.NavigationBar.right);
});

// Kick off the init
$.init();
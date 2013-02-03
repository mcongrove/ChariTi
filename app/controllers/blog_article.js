var APP = require("core");
var SOCIAL = require("social");
var DATE = require("alloy/moment");
var STRING = require("alloy/string");

var MODEL = (function() {
	var Model = require("models/blog");

	return new Model();
})();

var CONFIG = arguments[0] || {};
var ACTION = {};

$.init = function() {
	APP.log("debug", "blog_article.init | " + JSON.stringify(CONFIG));

	MODEL.init(CONFIG.index);

	$.handleData(MODEL.getArticle(CONFIG.id));
};

$.handleData = function(_data) {
	APP.log("debug", "blog_article.handleData");

	$.handleNavigation(_data.id);

	$.heading.text = _data.title;
	$.text.value = _data.description;
	$.date.text = STRING.ucfirst(DATE(parseInt(_data.date)).fromNow());
	$.date.color = APP.Settings.colors.primary;

	if(_data.image) {
		var width = APP.Device.width - 60;

		var image = Ti.UI.createImageView({
			image: _data.image,
			width: width + "dp",
			height: Ti.UI.SIZE,
			preventDefaultImage: true
		});

		$.image.add(image);
	} else {
		$.content.remove($.image)
	}

	ACTION.url = _data.link;

	$.NavigationBar.Wrapper.backgroundColor = APP.Settings.colors.primary || "#000";
	$.NavigationBar.back.visible = APP.Device.isHandheld;
	$.NavigationBar.right.visible = true;
	$.NavigationBar.rightImage.image = "/images/action.png";
};

$.handleNavigation = function(_id) {
	ACTION.next = MODEL.getNextArticle(_id);
	ACTION.previous = MODEL.getPreviousArticle(_id);

	var navigation = Alloy.createWidget("com.chariti.detailNavigation", null, {
		down: function(_event) {
			APP.log("debug", "blog_article @next");

			APP.addChild("blog_article", {
				id: ACTION.next.id,
				index: CONFIG.index
			});
		},
		up: function(_event) {
			APP.log("debug", "blog_article @previous");

			APP.addChild("blog_article", {
				id: ACTION.previous.id,
				index: CONFIG.index
			});
		}
	}).getView();

	$.NavigationBar.Wrapper.add(navigation);
};

// Event listeners
$.NavigationBar.back.addEventListener("click", function(_event) {
	APP.log("debug", "blog_article @close");

	APP.removeAllChildren();
});

$.NavigationBar.right.addEventListener("click", function(_event) {
	APP.log("debug", "blog_article @menu");

	SOCIAL.share(ACTION.url, $.NavigationBar.right);
});

// Kick off the init
$.init();
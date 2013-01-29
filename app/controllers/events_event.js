var APP = require("core");
var UTIL = require("utilities");
var SOCIAL = require("social");
var MODEL = require("models/events");

var DATA = arguments[0] || {};
var ACTION = {};

$.init = function() {
	APP.log("debug", "events_event.init | " + JSON.stringify(DATA));

	$.handleData(MODEL.getEvent(DATA.id));
};

$.handleData = function(_data) {
	APP.log("debug", "events_event.handleData");

	$.handleNavigation(_data.date_start);

	$.heading.text = _data.title;
	$.text.value = _data.description;
	$.location.text = "@ " + _data.location;
	$.date.text = UTIL.toDateAbsolute(_data.date_start);
	$.date.color = APP.Settings.colors.primary;

	ACTION.url = "http://www.facebook.com/events/" + _data.id;

	$.NavigationBar.Wrapper.backgroundColor = APP.Settings.colors.primary || "#000";
	$.NavigationBar.back.visible = APP.Device.isHandheld;
	$.NavigationBar.right.visible = true;
	$.NavigationBar.rightImage.image = "/images/action.png";
};

$.handleNavigation = function(_date) {
	ACTION.next = MODEL.getNextEvent(_date);
	ACTION.previous = MODEL.getPreviousEvent(_date);

	var navigation = Ti.UI.createView({
		width: "96dp",
		height: "37dp",
		top: "5dp",
		backgroundImage: "/images/navigation.png"
	});

	var arrowNext = Ti.UI.createImageView({
		image: "/images/arrowDown.png",
		width: "47dp",
		height: "37dp",
		top: "0dp",
		right: "0dp"
	});

	var arrowPrevious = Ti.UI.createImageView({
		image: "/images/arrowUp.png",
		width: "47dp",
		height: "37dp",
		top: "0dp",
		left: "0dp"
	});

	if(ACTION.next) {
		arrowNext.addEventListener("click", function(_event) {
			APP.log("debug", "events_event @next");

			APP.addChild("events_event", {
				id: ACTION.next.id
			});
		});
	} else {
		arrowNext.opacity = 0.4;
	}

	if(ACTION.previous) {
		arrowPrevious.addEventListener("click", function(_event) {
			APP.log("debug", "events_event @previous");

			APP.addChild("events_event", {
				id: ACTION.previous.id
			});
		});
	} else {
		arrowPrevious.opacity = 0.4;
	}

	navigation.add(arrowNext);
	navigation.add(arrowPrevious);
	$.NavigationBar.Wrapper.add(navigation);
};

// Event listeners
$.NavigationBar.back.addEventListener("click", function(_event) {
	APP.log("debug", "events_event @close");

	APP.removeAllChildren();
});

$.NavigationBar.right.addEventListener("click", function(_event) {
	APP.log("debug", "events_event @menu");

	SOCIAL.share(ACTION.url);
});

// Kick off the init
$.init();
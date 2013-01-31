var APP = require("core");
var SOCIAL = require("social");
var MODEL = require("models/events");
var DATE = require("alloy/moment");

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
	$.date.text = DATE(parseInt(_data.date_start)).format("MMMM Do, YYYY h:mma");
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
	
	var navigation = Alloy.createWidget("com.chariti.detailNavigation", null, {
		down: function(_event) {
			APP.log("debug", "events_event @next");

			APP.addChild("events_event", {
				id: ACTION.next.id
			});
		},
		up: function(_event) {
			APP.log("debug", "events_event @previous");

			APP.addChild("events_event", {
				id: ACTION.previous.id
			});
		}
	}).getView();

	$.NavigationBar.Wrapper.add(navigation);
};

// Event listeners
$.NavigationBar.back.addEventListener("click", function(_event) {
	APP.log("debug", "events_event @close");

	APP.removeAllChildren();
});

$.NavigationBar.right.addEventListener("click", function(_event) {
	APP.log("debug", "events_event @menu");

	SOCIAL.share(ACTION.url, $.NavigationBar.right);
});

// Kick off the init
$.init();
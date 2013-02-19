var APP = require("core");
var SOCIAL = require("social");
var DATE = require("alloy/moment");
var MODEL = require("models/event")();

var CONFIG = arguments[0] || {};
var ACTION = {};

$.init = function() {
	APP.log("debug", "event_event.init | " + JSON.stringify(CONFIG));

	MODEL.init(CONFIG.index);

	$.handleData(MODEL.getEvent(CONFIG.id));
};

$.handleData = function(_data) {
	APP.log("debug", "event_event.handleData");

	$.handleNavigation(_data.date_start);

	$.heading.text = _data.title;
	$.text.value = _data.description;
	$.location.text = "@ " + _data.location;
	$.date.text = DATE(parseInt(_data.date_start, 10)).format("MMMM Do, YYYY h:mma");
	$.date.color = APP.Settings.colors.primary;

	ACTION.url = "http://www.facebook.com/events/" + _data.id;

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

$.handleNavigation = function(_date) {
	ACTION.next = MODEL.getNextEvent(_date);
	ACTION.previous = MODEL.getPreviousEvent(_date);

	var navigation = Alloy.createWidget("com.chariti.detailNavigation", null, {
		down: function(_event) {
			APP.log("debug", "event_event @next");

			APP.addChild("event_event", {
				id: ACTION.next.id,
				index: CONFIG.index
			});
		},
		up: function(_event) {
			APP.log("debug", "event_event @previous");

			APP.addChild("event_event", {
				id: ACTION.previous.id,
				index: CONFIG.index
			});
		}
	}).getView();

	$.NavigationBar.addNavigation(navigation);
};

// Kick off the init
$.init();
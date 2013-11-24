/**
 * Controller for the event node screen
 * 
 * @class Controllers.event.event
 * @uses Models.event
 * @uses core
 * @uses social
 * @uses Widgets.com.mcongrove.detailNavigation
 */
var APP = require("core");
var SOCIAL = require("social");
var DATE = require("alloy/moment");
var MODEL = require("models/event")();

var CONFIG = arguments[0] || {};
var ACTION = {};

/**
 * Initializes the controller
 */
$.init = function() {
	APP.log("debug", "event_event.init | " + JSON.stringify(CONFIG));

	MODEL.init(CONFIG.index);

	$.handleData(MODEL.getEvent(CONFIG.id));
};

/**
 * Handles the data return
 * @param {Object} _data The returned data
 */
$.handleData = function(_data) {
	APP.log("debug", "event_event.handleData");

	$.handleNavigation(_data.date_start);

	$.heading.text = _data.title;
	$.heading.color = APP.Settings.colors.hsb.primary.b > 70 ? "#000" : APP.Settings.colors.primary;
	$.text.value = _data.description;
	$.location.text = "@ " + _data.location;
	$.photo.image = "http://graph.facebook.com/" + _data.id + "/picture?type=large";
	$.date.text = DATE(parseInt(_data.date_start, 10)).format("MMMM Do, YYYY h:mma");

	ACTION.url = "http://www.facebook.com/events/" + _data.id;

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
 * @param {String} _date The date of the currently viewed event
 */
$.handleNavigation = function(_date) {
	ACTION.next = MODEL.getNextEvent(_date);
	ACTION.previous = MODEL.getPreviousEvent(_date);

	var navigation = Alloy.createWidget("com.mcongrove.detailNavigation", null, {
		color: APP.Settings.colors.theme == "dark" ? "white" : "black",
		down: function(_event) {
			APP.log("debug", "event_event @next");

			APP.addChild("event_event", {
				id: ACTION.next.id,
				index: CONFIG.index
			}, false, true);
		},
		up: function(_event) {
			APP.log("debug", "event_event @previous");

			APP.addChild("event_event", {
				id: ACTION.previous.id,
				index: CONFIG.index
			}, false, true);
		}
	}).getView();

	$.NavigationBar.addNavigation(navigation);
};

// Kick off the init
$.init();
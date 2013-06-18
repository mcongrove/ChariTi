var APP = require("core");

var CONFIG = arguments[0];

$.init = function() {
	APP.log("debug", "share.init | " + JSON.stringify(CONFIG));

	$.NavigationBar.setBackgroundColor(APP.Settings.colors.primary || "#000");

	$.loadData();

	if(CONFIG.isChild === true) {
		$.NavigationBar.showBack();
	}

	if(APP.Settings.useSlideMenu) {
		$.NavigationBar.showMenu();
	} else {
		$.NavigationBar.showSettings();
	}
};

$.loadData = function() {
	APP.log("debug", "share.loadData");

	var templates = CONFIG.templates;
	var rows = [];

	for(var i = 0, x = templates.length; i < x; i++) {
		var row = Alloy.createController("share_row", {
			id: i,
			heading: templates[i].title
		}).getView();

		rows.push(row);
	}

	$.templates.setData(rows);
};

// Event listeners
$.templates.addEventListener("click", function(_event) {
	APP.log("debug", "share @click " + _event.row.id);

	var text = CONFIG.templates[_event.row.id].text;

	var modal = Alloy.createController("share_preview", {
		text: text
	});

	var view = modal.getView();

	modal.buttonCancel.addEventListener("click", function(_event) {
		$.Wrapper.remove(view);
	});

	modal.buttonConfirm.addEventListener("click", function(_event) {
		$.Wrapper.remove(view);

		if(!Ti.UI.createEmailDialog().isSupported()) {
			alert("E-mail is not supported on your device.");

			return;
		}

		APP.addChild("share_contacts", {
			text: text
		});
	});

	$.Wrapper.add(view);
});

// Kick off the init
$.init();
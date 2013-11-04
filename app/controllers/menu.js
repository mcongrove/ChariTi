/**
 * Controller for the menu list screen
 * 
 * @class Controllers.menu
 * @uses core
 */
var APP = require("core");

var CONFIG = arguments[0];

/**
 * Initializes the controller
 */
$.init = function() {
	APP.log("debug", "menu.init | " + JSON.stringify(CONFIG));

	APP.openLoading();

	$.handleData(CONFIG.items);

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

/**
 * Handles the data return
 * @param {Object} _data The returned data
 */
$.handleData = function(_data) {
	APP.log("debug", "menu.handleData");

	var rows = [];

	for(var i = 0, x = _data.length; i < x; i++) {
		var row = Alloy.createController("menu_row", {
			title: _data[i].title,
			icon: "/icons/" + _data[i].image + ".png"
		}).getView();

		_data[i].isChild = true;

		row.rowData = _data[i];

		rows.push(row);
	}

	$.container.setData(rows);

	APP.closeLoading();
};

// Event listeners
$.container.addEventListener("click", function(_event) {
	APP.addChild(_event.row.rowData.type, _event.row.rowData);
});

// Kick off the init
$.init();
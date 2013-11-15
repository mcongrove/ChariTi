/**
 * The slide menu widget
 * 
 * @class Widgets.com.chariti.slideMenu
 * @uses core
 */
var APP = require("core");

var sections = [];
var tabs = [];

/**
 * Initializes the slide menu
 * @param {Object} _params
 * @param {Object} _params.tabs The tab items to show in the side menu as defined by the JSON configuration file
 */
$.init = function(_params) {
	$.tabs = [];

	// Add the Settings tab
	_params.tabs.push({
		id: "settings",
		image: "/icons/white/settings.png",
		title: "Settings"
	});

	//creates a TableViewSection for each tab with a menuHeader property
	buildSections(_params.tabs);

	if(sections.length > 0) {
		var currentSection = -1;
	}

	for(var i = 0; i < _params.tabs.length; i++) {
		// Iterates through the created sections
		if(_params.tabs[i].menuHeader) {
			currentSection++;
		}

		var tab = Ti.UI.createTableViewRow({
			id: _params.tabs[i].id,
			height: "47dp",
			backgroundcolor: "#111",
			backgroundSelectedColor: "#222",
			selectedBackgroundColor: "#222"
		});

		var label = Ti.UI.createLabel({
			text: _params.tabs[i].title,
			top: "0dp",
			left: "47dp",
			right: "13dp",
			height: "46dp",
			font: {
				fontSize: "16dp",
				fontFamily: "HelveticaNeue-Light"
			},
			color: "#FFF",
			touchEnabled: false
		});

		if(_params.tabs[i].image) {
			var icon = Ti.UI.createImageView({
				image: _params.tabs[i].image,
				width: "21dp",
				height: "21dp",
				top: "13dp",
				left: "13dp",
				touchEnabled: false,
				preventDefaultImage: true
			});

			tab.add(icon);
		}

		tab.add(label);

		if(sections.length > 0) {
			sections[currentSection].add(tab);

			//If the last tab has been created and added to a section or
			//the next tab is a new header, append the current section to the TableView
			if(i + 1 !== _params.tabs.length) {
				if(_params.tabs[i + 1].menuHeader) {
					$.Tabs.appendSection(sections[currentSection]);
				}
			} else {
				$.Tabs.appendSection(sections[currentSection]);
			}
		} else {
			tabs.push(tab);
		}
	}

	if(tabs.length > 0) {
		$.Tabs.setData(tabs);
	}
};

/**
 * Builds out the table sections
 * @param {Object} _tabs The tab items to show in the side menu
 * @private
 */
function buildSections(_tabs) {
	for(var i = 0; i < _tabs.length; i++) {
		// Assigns special menuHeader styling
		if(_tabs[i].menuHeader) {
			var section = Ti.UI.createTableViewSection();

			var header = Ti.UI.createView({
				top: "0dp",
				height: "20dp",
				width: Ti.UI.FILL,
				backgroundColor: APP.Settings.colors.primary
			});

			var headerText = Ti.UI.createLabel({
				text: _tabs[i].menuHeader,
				top: "2dp",
				left: "13dp",
				font: {
					fontSize: "12dp",
					fontWeight: "HelveticaNeue-Light"
				},
				color: APP.Settings.colors.theme == "dark" ? "#FFF" : "#000",
				touchEnabled: false,
				verticalAlignment: Titanium.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,
				isHeader: true
			});

			header.add(headerText);

			section.headerView = header;

			sections.push(section);
		}
	}
};

/**
 * Clears all items from the side menu
 */
$.clear = function() {
	$.Tabs.removeAllChildren();
};

/**
 * Sets the indexed item as active
 * @param {Object} _index The index of the item to show as active
 */
$.setIndex = function(_index) {
	$.Tabs.selectRow(_index);
};

$.Tabs.addEventListener("click", function(_event) {
	if(typeof _event.index !== "undefined") {
		$.setIndex(_event.index);
	}
});

// Move the UI down if iOS7+
if(OS_IOS && APP.Device.versionMajor >= 7) {
	$.Tabs.top = "20dp";
}
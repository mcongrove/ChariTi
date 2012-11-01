var Alloy = require("alloy");

/**
 * Main app singleton
 * @type {Object}
 */
var APP = {
	/**
	 * Holds data from the JSON config file
	 */
	ID: null,
	Nodes: [],
	Plugins: null,
	Settings: null,
	/**
	 * Keeps track of the current screen controller
	 * @type {Object}
	 */
	currentController: null,
	currentControllerId: null,
	/**
	 * The detail controller
	 * @type {Object}
	 */
	detailController: null,
	/**
	 * Setup the main content database
	 * @type {Object}
	 */
	Database: null,
	/**
	 * The main app window
	 * @type {Object}
	 */
	MainWindow: null,
	/**
	 * The global view all screen controllers get added to
	 * @type {Object}
	 */
	GlobalWrapper: null,
	/**
	 * The global view all content screen controllers get added to
	 * @type {Object}
	 */
	ContentWrapper: null,
	/**
	 * Tabs Widget
	 * @type {Object}
	 */
	Tabs: null,
	/**
	 * Sets up the app singleton and all it"s child dependencies
	 * NOTE: This should only be fired in index controller file and only once.
	 */
	init: function() {
		// Global system Events
		Ti.Network.addEventListener("change", APP.networkObserverUpdate);
		Ti.App.addEventListener("pause", APP.exit);
		Ti.App.addEventListener("close", APP.exit);
		Ti.App.addEventListener("resumed", APP.resume);
		
		// Create a database
		APP.setupDatabase();
		
		// Reads in the JSON config file
		APP.loadContent();
		
		// Builds out the tab group
		APP.build();
	},
	/**
	 * Loads in the appropriate controllers
	 */
	loadContent: function() {
		var contentFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, "app.json");
		
		if(!contentFile.exists()) {
			contentFile = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory + "data/app.json");
		}
		
		var content = contentFile.read();
		var data = JSON.parse(content.text);
		
		APP.ID = data.id;
		APP.Settings = data.settings;
		APP.Plugins = data.plugins;
		APP.Nodes = data.tabs;
	},
	/**
	 * Builds out the tab group
	 */
	build: function() {
		var tabs = [];
		
		for(var i = 0; i < APP.Nodes.length; i++) {
			tabs.push({
				id: i,
				title: APP.Nodes[i].title,
				image: APP.Nodes[i].image,
				controller: APP.Nodes[i].type
			});
		}
		
		// Create a tab group
		APP.Tabs.init(tabs);

		// Add a handler for the spinner (drop-down selection)
		APP.Tabs.Wrapper.addEventListener("click", function(_event) {
			APP.handleNavigation(_event.source.id);
		});
	},
	/**
	 * Setup the database bindings
	 */
	setupDatabase: function() {
		APP.Database = Ti.Database.open("Charitti");
	},
	/**
	 * Global event handler to change screens
	 * @param  {String} _id The ID of the tab being opened
	 */
	handleNavigation: function(_id) {
		// Requesting same screen as we"re on
		if(_id == APP.currentControllerId) {
			// Do nothing
		} else {
			APP.currentControllerId = _id;

			// Remove current controller view
			APP.removeCurrentScreen(function() {
				// Create the new screen controller
				APP.currentController = Alloy.createController(APP.Nodes[_id].type, APP.Nodes[_id]);

				// Add the new screen to the window
				APP.ContentWrapper.add(APP.currentController.Wrapper);
			});
		}
	},
	/**
	 * Global function to remove screens
	 * @param {Function} _callback
	 */
	removeCurrentScreen: function(_callback) {
		if(APP.currentController) {
			APP.ContentWrapper.remove(APP.currentController.Wrapper);
			
			APP.currentController = null;
		}

		if(typeof(_callback) !== "undefined") {
			_callback();
		}
	},
	/**
	 * Open the detail screen
	 * @param {String} _controller The name of the controller to open
	 * @param {Object} _params An optional dictionary of parameters to pass to the controller
	 */
	openDetailScreen: function(_controller, _params) {
		// Create the new screen controller
		APP.detailController = Alloy.createController(_controller, _params);
		
		APP.MainWindow.add(APP.detailController.Wrapper);
	},
	/**
	 * Removes the detail screen
	 * @param {Function} _callback
	 */
	removeDetailScreen: function(_callback) {
		if(APP.detailController) {
			APP.ContentWrapper.remove(APP.detailController.Wrapper);
			
			APP.detailController = null;
		}

		if(typeof(_callback) !== "undefined") {
			_callback();
		}
	},
	/**
	 * Global network event handler
	 * @param  {Object} _event Standard Ti callback
	 */
	networkObserverUpdate: function(_event) {

	},
	/**
	 * Exit event observer
	 */
	exit: function() {

	},
	/**
	 * Resume event observer
	 */
	resume: function() {
		// TODO: Check last time we updated, re-synch if it's been a while
	}
};

module.exports = APP;
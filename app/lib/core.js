var Alloy	= require("alloy");
var HTTP	= require("http");

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
	 * Temporary holder for the previous screen controller
	 */
	previousController: null,
	/**
	 * The detail controller
	 * @type {Object}
	 */
	currentDetailController: null,
	detailControllers: [],
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
		Ti.API.debug("APP.init");
		
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
		
		// Updates the app.json file from a remote source
		APP.update();
	},
	/**
	 * Loads in the appropriate controllers
	 */
	loadContent: function() {
		Ti.API.debug("APP.loadContent");
		
		var contentFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, "app.json");
		
		if(!contentFile.exists()) {
			contentFile = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory + "data/app.json");
		}
		
		var content = contentFile.read();
		var data = JSON.parse(content.text);
		
		APP.ID = data.id;
		APP.ConfigurationURL = data.configurationUrl && data.configurationUrl.length > 7 ? data.configurationUrl : false;
		APP.Settings = data.settings;
		APP.Plugins = data.plugins;
		APP.Nodes = data.tabs;
	},
	/**
	 * Builds out the tab group
	 */
	build: function() {
		Ti.API.debug("APP.build");
		
		var tabs = [];
		
		for(var i = 0, x = APP.Nodes.length; i < x; i++) {
			tabs.push({
				id: i,
				title: APP.Nodes[i].title,
				image: "/icons/" + APP.Nodes[i].image + ".png",
				controller: APP.Nodes[i].type.toLowerCase()
			});
		}
		
		// Create a tab group
		APP.Tabs.init({
			tabs: tabs,
			colors: {
				primary: APP.Settings.colors.primary,
				secondary: APP.Settings.colors.secondary,
				text: APP.Settings.colors.text
			}
		});

		// Add a handler for the spinner (drop-down selection)
		APP.Tabs.Wrapper.addEventListener("click", function(_event) {
			APP.handleNavigation(_event.source.id);
		});
	},
	/**
	 * Updates the app.json from a remote source
	 */
	update: function() {
		Ti.API.debug("APP.update");
		
		if(APP.ConfigurationURL) {
			HTTP.request({
				timeout: 10000,
				type: "GET",
				format: "DATA",
				url: APP.ConfigurationURL,
				success: function(_data) {
					Ti.API.debug("APP.update @loaded");
					
					var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, "app.json");
					
					file.write(_data);
				}
			});
		}
	},
	/**
	 * Setup the database bindings
	 */
	setupDatabase: function() {
		Ti.API.debug("APP.setupDatabase");
		
		var db = Ti.Database.open("Charitti");
		
		db.execute("CREATE TABLE IF NOT EXISTS updates (url TEXT PRIMARY KEY, time TEXT);");
		
		db.close();
	},
	/**
	 * Global event handler to change screens
	 * @param  {String} _id The ID of the tab being opened
	 */
	handleNavigation: function(_id) {
		Ti.API.debug("APP.handleNavigation");
		
		// Requesting same screen as we"re on
		if(_id == APP.currentControllerId) {
			// Do nothing
		} else {
			// Save the current controller for removal
			APP.previousController = APP.currentController;
			
			// Create a new screen
			APP.currentControllerId = _id;
			APP.currentController = Alloy.createController(APP.Nodes[_id].type.toLowerCase(), APP.Nodes[_id]).getView();
			
			// Add the new screen to the window
			APP.ContentWrapper.add(APP.currentController);

			// Remove previouw controller view
			APP.removeScreen(APP.previousController);
		}
	},
	/**
	 * Global function to remove screens
	 * @param {Function} _callback
	 */
	removeScreen: function(_controller) {
		APP.closeAllDetailScreens();
		
		if(_controller) {
			APP.ContentWrapper.remove(_controller);
			
			APP.previousController = null;
		}
	},
	/**
	 * Open the detail screen
	 * @param {String} _controller The name of the controller to open
	 * @param {Object} _params An optional dictionary of parameters to pass to the controller
	 */
	openDetailScreen: function(_controller, _params) {
		// Create the new screen controller
		APP.currentDetailController = Alloy.createController(_controller, _params).getView();
		
		APP.detailControllers.push(APP.currentDetailController);
		
		APP.ContentWrapper.add(APP.currentDetailController);
	},
	/**
	 * Removes the detail screen
	 * @param {Function} _callback
	 */
	closeDetailScreen: function(_callback) {
		if(APP.currentDetailController) {
			APP.ContentWrapper.remove(APP.currentDetailController);
			APP.detailControllers.pop();
			
			APP.currentDetailController = null;
		}

		if(typeof(_callback) !== "undefined") {
			_callback();
		}
	},
	/**
	 * Removes ALL detail screens
	 * @param {Function} _callback
	 */
	closeAllDetailScreens: function(_callback) {
		for(var i = 0, x = APP.detailControllers.length; i < x; i++) {
			APP.ContentWrapper.remove(APP.detailControllers[i]);
		}
		
		APP.detailControllers = [];
	},
	/**
	 * Global network event handler
	 * @param  {Object} _event Standard Ti callback
	 */
	networkObserverUpdate: function(_event) {
		Ti.API.debug("APP.networkObserverUpdate");
	},
	/**
	 * Exit event observer
	 */
	exit: function() {
		Ti.API.debug("APP.exit");
	},
	/**
	 * Resume event observer
	 */
	resume: function() {
		// TODO: Check last time we updated, re-synch if it's been a while
		Ti.API.debug("APP.resume");
	}
};

module.exports = APP;
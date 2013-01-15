var Alloy	= require("alloy");
var HTTP	= require("http");
var UTIL	= require("utilities");
var UA;

/**
 * Main app singleton
 * @type {Object}
 */
var APP = {
	/**
	 * Holds data from the JSON config file
	 */
	ID: null,
	VERSION: null,
	CVERSION: "1.0.0.1213122040",
	LEGAL: {
		COPYRIGHT: null,
		TOS: null,
		PRIVACY: null
	},
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
	currentStack: -1,
	controllerStacks: [],
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
	 * The loading view
	 * @type {Object}
	 */
	Loading: Alloy.createWidget("com.chariti.loading").getView(),
	cancelLoading: false,
	loadingOpen: false,
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
		
		// Set up push notifications
		if(APP.Settings.notifications.enabled) {
			APP.registerPush();
		}
	},
	/**
	 * Loads in the appropriate controller and config data
	 */
	loadContent: function() {
		APP.log("debug", "APP.loadContent");
		
		var contentFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, "app.json");
		
		if(!contentFile.exists()) {
			contentFile = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory + "data/app.json");
		}
		
		var content = contentFile.read();
		var data;
		
		try {
			data = JSON.parse(content.text);
		} catch(_error) {
			APP.log("error", "Unable to parse downloaded JSON, reverting to packaged JSON");
			
			contentFile = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory + "data/app.json");
			content = contentFile.read();
			data = JSON.parse(content.text);
		}
		
		APP.ID = data.id;
		APP.VERSION = data.version;
		APP.LEGAL = {
			COPYRIGHT: data.legal.copyright,
			TOS: data.legal.terms,
			PRIVACY: data.legal.privacy
		};
		
		APP.ConfigurationURL = data.configurationUrl && data.configurationUrl.length > 10 ? data.configurationUrl : false;
		APP.Settings = data.settings;
		APP.Plugins = data.plugins;
		APP.Nodes = data.tabs;
	},
	/**
	 * Builds out the tab group
	 * @param {Boolean} _rebuild Whether this is a re-build or not
	 */
	build: function(_rebuild) {
		APP.log("debug", "APP.build");
		
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

		if(!_rebuild) {
			// Add a handler for the spinner (drop-down selection)
			APP.Tabs.Wrapper.addEventListener("click", function(_event) {
				APP.handleNavigation(_event.source.id);
			});
		}
	},
	/**
	 * Updates the app.json from a remote source
	 */
	update: function() {
		APP.log("debug", "APP.update");
		
		if(APP.ConfigurationURL) {
			HTTP.request({
				timeout: 10000,
				type: "GET",
				format: "DATA",
				url: APP.ConfigurationURL,
				success: function(_data) {
					APP.log("debug", "APP.update @loaded");
					
					// Determine if this is the same version as we already have
					var data = JSON.parse(_data);
					
					if(data.version == APP.VERSION) {
						// We already have it
						APP.log("info", "Application is up-to-date");
						
						return;
					}
					
					var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, "app.json");
					
					file.write(_data);
					
					var dialog = Ti.UI.createAlertDialog({
						title: "Update Available",
						message: "New content has been downloaded. Would you like to refresh the application now?",
						buttonNames: [ "No", "Yes" ],
						cancel: 0
					});
					
					dialog.addEventListener("click", function(_event) {
						if(_event.index != _event.source.cancel) {
							APP.log("info", "Update accepted");
							
							APP.rebuild();
						} else {
							APP.log("info", "Update declined");
							
							dialog = Ti.UI.createAlertDialog({
								title: "Update Declined",
								message: "The updates will take effect the next time you restart the application."
							});
							
							dialog.show();
						}
					});
					
					dialog.show();
				}
			});
		}
	},
	/**
	 * Re-builds the app with newly downloaded JSON configration file
	 */
	rebuild: function() {
		APP.log("debug", "APP.rebuild");
		
		APP.Tabs.clear();
		APP.removeScreen(APP.currentController);
		
		APP.currentControllerId		= null;
		APP.currentController		= null;
		APP.previousController		= null;
		APP.currentDetailController	= null;
		APP.detailControllers		= [];
		
		APP.loadContent();
		
		APP.build(true);
		
		APP.handleNavigation(0);
	},
	/**
	 * Setup the database bindings
	 */
	setupDatabase: function() {
		Ti.API.debug("APP.setupDatabase");
		
		var db = Ti.Database.open("ChariTi");
		
		db.execute("CREATE TABLE IF NOT EXISTS updates (url TEXT PRIMARY KEY, time TEXT);");
		db.execute("CREATE TABLE IF NOT EXISTS log (time INTEGER, type TEXT, message TEXT);");
		
		// Fill the log table with empty rows that we can 'update', providing a max row limit
		var data = db.execute("SELECT time FROM log;");
		
		if(data.rowCount === 0) {
			db.execute("BEGIN TRANSACTION;");
			
			for(var i = 0; i < 100; i++) {
				db.execute("INSERT INTO log VALUES (" + i + ", \"\", \"\");");
			}
			
			db.execute("END TRANSACTION;");
		}
		
		data.close();
		db.close();
	},
	/**
	 * Global event handler to change screens
	 * @param  {String} _id The ID of the tab being opened
	 */
	handleNavigation: function(_id) {
		APP.log("debug", "APP.handleNavigation");

		// Requesting same screen as we're on
		if (_id == APP.currentStack) {
			// Do nothing
		} else {
			// Move the tab selection indicator
			APP.Tabs.setIndex(_id);

			if (typeof(APP.controllerStacks[_id]) === 'undefined') {
				APP.controllerStacks[_id] = [];
			}

			var controllerStack = APP.controllerStacks[_id];
			
			APP.currentStack = _id;
			
			// Closes any loading screens
			APP.closeLoading();

			var controller;
			if (controllerStack.length > 0) {
				controller = controllerStack[controllerStack.length - 1];
				APP.addScreen(controller);
			} else {
				// Create a new screen
				controller = Alloy.createController(APP.Nodes[_id].type.toLowerCase(), APP.Nodes[_id]).getView();
				
				// Add the new screen to the window
				APP.addScreen(controller);
				controllerStack.push(controller);
			}

			// // Remove previous controller view
			// APP.removeScreen(APP.previousController);

		}
	},
	/**
	 * Global function to remove screens
	 * @param {Function} _callback
	 */
	removeScreen: function(_controller) {
		// APP.closeAllDetailScreens();
		
		if(_controller) {
			APP.ContentWrapper.remove(_controller);
			
			APP.previousController = null;
		}
	},
	/**
	 * Global function to add screens
	 * @param {Function} _callback
	 */
	addScreen: function(_controller) {
		// APP.closeAllDetailScreens();

		console.log(APP.ContentWrapper.children.length);
		
		if(_controller) {

			APP.ContentWrapper.add(_controller);

			// Save the current controller for removal
			if (APP.previousController) {
				APP.removeScreen(APP.previousController);
			}
			
			APP.previousController = _controller;
		}
	},
	/**
	 * Open the detail screen
	 * @param {String} _controller The name of the controller to open
	 * @param {Object} _params An optional dictionary of parameters to pass to the controller
	 */
	openDetailScreen: function(_controller, _params) {
		var controllerStack = APP.controllerStacks[APP.currentStack];

		// Create the new screen controller
		var controller = Alloy.createController(_controller, _params).getView();

		APP.addScreen(controller);
		controllerStack.push(controller);
	},
	/**
	 * Removes the detail screen
	 * @param {Function} _callback
	 */
	closeDetailScreen: function(_callback) {
		var controllerStack = APP.controllerStacks[APP.currentStack];
		controllerStack.pop();

		if(controllerStack.length > 0) {
			var controllercontroller = controllerStack[controllerStack.length - 1];
			APP.addScreen(controller);
		} else {
			APP.previousController = null;
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
	 * Shows the loading screen
	 */
	openLoading: function() {
		APP.cancelLoading = false;
		
		setTimeout(function() {
			if(!APP.cancelLoading) {
				APP.loadingOpen = true;
				
				APP.GlobalWrapper.add(APP.Loading);
			}
		}, 100);
	},
	/**
	 * Closes the loading screen
	 */
	closeLoading: function() {
		APP.cancelLoading = true;
		
		if(APP.loadingOpen) {
			APP.GlobalWrapper.remove(APP.Loading);
			
			APP.loadingOpen = false;
		}
	},
	/**
	 * Opens the settings window
	 */
	openSettings: function() {
		APP.log("debug", "APP.openSettings");
		
		APP.openDetailScreen("settings");
	},
	/**
	 * Registers the app for push notifications
	 */
	registerPush: function() {
		APP.log("debug", "APP.registerPush");
		
		UA = require("ti.urbanairship");
		
		UA.options = {
			APP_STORE_OR_AD_HOC_BUILD: true,
			PRODUCTION_APP_KEY: APP.Settings.notifications.key,
			PRODUCTION_APP_SECRET: APP.Settings.notifications.secret,
			LOGGING_ENABLED: false
		};
		
		Ti.Network.registerForPushNotifications({
			types: [
				Ti.Network.NOTIFICATION_TYPE_BADGE,
				Ti.Network.NOTIFICATION_TYPE_ALERT,
				Ti.Network.NOTIFICATION_TYPE_SOUND
			],
			success: function(_event) {
				APP.log("debug", "APP.registerPush @success");
				APP.log("trace", _event.deviceToken);
				
				UA.registerDevice(_event.deviceToken, {
					tags: [
						APP.ID,
						APP.Version,
						Ti.Platform.osname,
						Ti.Platform.locale
					]
				});
			},
			error: function(_event) {
				APP.log("debug", "APP.registerPush @error");
				APP.log("trace", JSON.stringify(_event));
			},
			callback: function(_event) {
				APP.log("debug", "APP.registerPush @callback");
				APP.log("trace", JSON.stringify(_event));
				
				UA.handleNotification(_event.data);
			}
		});
	},
	/**
	 * Logs all console data
	 * @param {String} _severity A severity type (error, trace, info)
	 * @param {String} _text The text to log
	 */
	log: function(_severity, _text) {
		switch(_severity.toLowerCase()) {
			case "debug":
				Ti.API.debug(_text);
				break;
			case "error":
				Ti.API.error(_text);
				break;
			case "info":
				Ti.API.info(_text);
				break;
			case "log":
				Ti.API.log(_text);
				break;
			case "trace":
				Ti.API.trace(_text);
				break;
			case "warn":
				Ti.API.warn(_text);
				break;
		}
		
		var db		= Ti.Database.open("ChariTi");
		
		var time	= new Date().getTime();
		var type	= UTIL.escapeString(_severity);
		var message	= UTIL.escapeString(_text);
		
		db.execute("UPDATE log SET time = " + time + ", type = " + type + ", message = " + message + " WHERE time = (SELECT min(time) FROM log);");
		db.close();
	},
	/**
	 * Sends the log files via e-mail dialog
	 */
	logSend: function() {
		var db	= Ti.Database.open("ChariTi");
		var data = db.execute("SELECT * FROM log WHERE message != \"\" ORDER BY time DESC;");
		
		var log = APP.ID + " " + APP.VERSION + " (" + APP.CVERSION + ")\n"
				+ Ti.Platform.locale + "\n"
				+ Ti.Platform.osname + " " + Ti.Platform.version + " (" + Ti.Platform.model + ")\n\n"
				+ "=====\n\n";
		
		while(data.isValidRow()) {
			log += "[" + data.fieldByName("type") + "] " + data.fieldByName("message") + "\n";
			
			data.next();
		}
		
		log += "\n=====";
		
		data.close();
		db.close();
		
		var email = Ti.UI.createEmailDialog({
			barColor: "#000",
			subject: "Application Log",
			messageBody: log
		});
		
		if(email.isSupported) {
			email.open();
		}
	},
	/**
	 * Global network event handler
	 * @param {Object} _event Standard Ti callback
	 */
	networkObserverUpdate: function(_event) {
		APP.log("debug", "APP.networkObserverUpdate");
	},
	/**
	 * Exit event observer
	 */
	exit: function() {
		APP.log("debug", "APP.exit");
	},
	/**
	 * Resume event observer
	 */
	resume: function() {
		APP.log("debug", "APP.resume");
	}
};

module.exports = APP;
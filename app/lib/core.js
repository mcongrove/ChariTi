var Alloy	= require("alloy");
var HTTP	= require("http");
var UTIL	= require("utilities");
var MIGRATE	= require("migrate");
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
	CVERSION: "1.1.0.0120131716",
	LEGAL: {
		COPYRIGHT: null,
		TOS: null,
		PRIVACY: null
	},
	Nodes: [],
	Plugins: null,
	Settings: null,
	/**
	 * Device information
	 */
	Device: {
		isHandheld: Alloy.isHandheld,
		isTablet: Alloy.isTablet,
		type: Alloy.isHandheld ? "handheld" : "tablet",
		os: null,
		name: null,
		version: Titanium.Platform.version,
		versionMajor: null,
		versionMinor: null,
		width: Ti.Platform.displayCaps.platformWidth > Ti.Platform.displayCaps.platformHeight ? Ti.Platform.displayCaps.platformHeight : Ti.Platform.displayCaps.platformWidth,
		height: Ti.Platform.displayCaps.platformWidth > Ti.Platform.displayCaps.platformHeight ? Ti.Platform.displayCaps.platformWidth : Ti.Platform.displayCaps.platformHeight,
		dpi: Ti.Platform.displayCaps.dpi,
		orientation: Ti.UI.orientation == Ti.UI.LANDSCAPE_LEFT || Ti.UI.orientation == Ti.UI.LANDSCAPE_RIGHT ? "LANDSCAPE" : "PORTRAIT",
		statusBarOrientation: null
	},
	/**
	 * Network connectivity information
	 */
	Network: {
		type: Ti.Network.networkTypeName,
		online: Ti.Network.online
	},
	/**
	 * The stack controller
	 * @type {Object}
	 */
	currentStack: -1,
	previousScreen: null,
	controllerStacks: [],
	nonTabStacks: {},
	hasDetail: false,
	currentDetailStack: -1,
	previousDetailScreen: null,
	detailStacks: [],
	Master: [],
	Detail: [],
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
		Ti.Network.addEventListener("change", APP.networkObserver);
		Ti.Gesture.addEventListener("orientationchange", APP.orientationObserver);
		Ti.App.addEventListener("pause", APP.exitObserver);
		Ti.App.addEventListener("close", APP.exitObserver);
		Ti.App.addEventListener("resumed", APP.resumeObserver);
		
		// Determine device characteristics
		APP.determineDevice();
		
		// Migrate to newer ChariTi version
		MIGRATE.init(APP.CVERSION);
		
		// Create a database
		APP.setupDatabase();
		
		// Reads in the JSON config file
		APP.loadContent();
		
		// Builds out the tab group
		APP.build();
		
		// Open the main window
		APP.MainWindow.open();
		
		// The initial screen to show
		APP.handleNavigation(0);
		
		// Updates the app.json file from a remote source
		APP.update();
		
		// Set up push notifications
		if(OS_IOS) {
			if(APP.Settings.notifications.enabled) {
				APP.registerPush();
			}
		}
	},
	/**
	 * Determines the device characteristics
	 */
	determineDevice: function() {
		APP.Device.versionMajor	= parseInt(APP.Device.version.split(".")[0], 10);
		APP.Device.versionMinor	= parseInt(APP.Device.version.split(".")[1], 10);
		
		if(OS_IOS) {
			APP.Device.os = "IOS";
			
			if(Ti.Platform.osname.toUpperCase() == "IPHONE") {
				APP.Device.name = "IPHONE";
			} else if(Ti.Platform.osname.toUpperCase() == "IPAD") {
				APP.Device.name = "IPAD";
			}
		} else if(OS_ANDROID) {
			APP.Device.os = "ANDROID";
			
			APP.Device.name = Ti.Platform.model.toUpperCase();
			
			// Fix the display values
			APP.Device.width	= (APP.Device.width / (APP.Device.dpi / 160));
			APP.Device.height	= (APP.Device.height / (APP.Device.dpi / 160));
		}
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
			
			contentFile	= Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory + "data/app.json");
			content		= contentFile.read();
			data		= JSON.parse(content.text);
		}
		
		APP.ID		= data.id;
		APP.VERSION	= data.version;
		APP.LEGAL	= {
			COPYRIGHT: data.legal.copyright,
			TOS: data.legal.terms,
			PRIVACY: data.legal.privacy
		};
		
		APP.ConfigurationURL	= data.configurationUrl && data.configurationUrl.length > 10 ? data.configurationUrl : false;
		APP.Settings			= data.settings;
		APP.Plugins				= data.plugins;
		APP.Nodes				= data.tabs;
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
			// Add a handler for the TabGroup
			APP.Tabs.Wrapper.addEventListener("click", function(_event) {
				if(typeof _event.source.id == "number") {
					APP.handleNavigation(_event.source.id);
				}
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
		
		APP.currentStack			= -1;
		APP.previousScreen			= null;
		APP.controllerStacks		= [];
		APP.nonTabStacks			= {};
		APP.hasDetail				= false;
		APP.currentDetailStack		= -1;
		APP.previousDetailScreen	= null;
		APP.detailStacks			= [];
		APP.Master					= [];
		APP.Detail					= [];
		APP.cancelLoading			= false;
		APP.loadingOpen				= false;
		
		APP.loadContent();
		
		APP.build(true);
		
		APP.handleNavigation(0);
	},
	/**
	 * Global event handler to change screens
	 * @param  {String} _id The ID of the tab being opened
	 */
	handleNavigation: function(_id) {
		APP.log("debug", "APP.handleNavigation | " + APP.Nodes[_id].type);

		// Requesting same screen as we're on
		if(_id == APP.currentStack) {
			// Do nothing
		} else {
			// Move the tab selection indicator
			APP.Tabs.setIndex(_id);
			
			// Closes any loading screens
			APP.closeLoading();
			
			// Set current stack
			APP.currentStack = _id;
			
			// Create new controller stack if it doesn't exist
			if(typeof APP.controllerStacks[_id] === "undefined") {
				APP.controllerStacks[_id] = [];
			}
			
			if(APP.Device.isTablet) {
				APP.currentDetailStack = _id;
				
				if(typeof APP.detailStacks[_id] === "undefined") {
					APP.detailStacks[_id] = [];
				}
			}
			
			// Set current controller stack
			var controllerStack = APP.controllerStacks[_id];
			
			// If we're opening for the first time, create new screen
			// Otherwise, add the last screen in the stack (screen we navigated away from earlier on)
			var screen;
			
			APP.hasDetail = false;
			APP.previousDetailScreen = null;
			
			if(controllerStack.length > 0) {
				// Retrieve the last screen
				if(APP.Device.isTablet) {
					screen = controllerStack[0];
					
					if(screen.type == "tablet") {
						APP.hasDetail = true;
					}
				} else {
					screen = controllerStack[controllerStack.length - 1];
				}
			} else {
				// Create a new screen
				var type = APP.Nodes[_id].type.toLowerCase();
				
				if(APP.Device.isTablet) {
					var file = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, "alloy", "controllers", type + "_tablet.js");
					
					if(file.exists()) {
						type = type + "_tablet";
						
						APP.hasDetail = true;
					}
				}
				
				screen = Alloy.createController(type, APP.Nodes[_id]).getView();
				
				// Add screen to the controller stack
				controllerStack.push(screen);
			}
			
			// Add the screen to the window
			APP.addScreen(screen);
			
			// TODO: Fix this for tablets
			// Tell the screen it was added to the window
			/*
			if(!APP.hasDetail) {
				screen.fireEvent("APP:screenAdded");
			}
			*/
		}
		
		APP.nonTabStacks = {};
	},
	/**
	 * Open a child screen
	 * @param {String} _controller The name of the controller to open
	 * @param {Object} _params An optional dictionary of parameters to pass to the controller
	 */
	addChild: function(_controller, _params, _stack) {
		var stack;
		
		// Determine if stack is associated with a tab
		if(typeof _stack !== "undefined") {
			if(typeof APP.nonTabStacks[_stack] === "undefined") {
				APP.nonTabStacks[_stack] = [];
			}
			
			stack = APP.nonTabStacks[_stack];
		} else {
			if(APP.Device.isHandheld || !APP.hasDetail) {
				stack = APP.controllerStacks[APP.currentStack];
			} else {
				stack = APP.detailStacks[APP.currentDetailStack];
			}
		}
		 
		// Create the new screen controller
		var screen = Alloy.createController(_controller, _params).getView();
		
		// Add screen to the controller stack
		stack.push(screen);
		
		// Add the screen to the window
		if(APP.Device.isHandheld || !APP.hasDetail || typeof _stack !== "undefined") {
			APP.addScreen(screen);
		} else {
			APP.addDetailScreen(screen);
		}
	},
	/**
	 * Removes a child screen
	 */
	removeChild: function(_stack) {
		var stack	= (typeof _stack !== "undefined") ? APP.nonTabStacks[_stack] : APP.controllerStacks[APP.currentStack];
		
		if(APP.Device.isTablet && APP.hasDetail) {
			stack	= (typeof _stack !== "undefined") ? APP.nonTabStacks[_stack] : APP.detailStacks[APP.currentDetailStack];
		}
		
		var screen	= stack[stack.length - 1];
		var previousStack;
		var previousScreen;
		
		stack.pop();
		
		if(stack.length === 0) {
			previousStack = APP.controllerStacks[APP.currentStack];
			
			if(APP.Device.isHandheld || !APP.hasDetail) {
				previousScreen	= previousStack[previousStack.length - 1];
				
				APP.addScreen(previousScreen);
			} else {
				previousScreen	= previousStack[0];
				
				if(typeof _stack !== "undefined") {
					APP.addScreen(previousScreen);
				} else {
					APP.addDetailScreen(previousScreen);
				}
			}
		} else {
			previousScreen = stack[stack.length - 1];
			
			if(APP.Device.isHandheld || !APP.hasDetail) {
				APP.addScreen(previousScreen);
			} else {
				if(typeof _stack !== "undefined") {
					APP.addScreen(previousScreen);
				} else {
					APP.addDetailScreen(previousScreen);
				}
			}
		}
	},
	/**
	 * Removes all children screens
	 */
	removeAllChildren: function(_stack) {
		var stack = (typeof _stack !== "undefined") ? APP.nonTabStacks[_stack] : APP.controllerStacks[APP.currentStack];
		
		for(var i = stack.length - 1; i > 0; i--) {
			stack.pop();
		}
		
		APP.addScreen(stack[0]);
	},
	/**
	 * Global function to add a screen
	 */
	addScreen: function(_screen) {
		if(_screen) {
			APP.ContentWrapper.add(_screen);
			
			if(APP.previousScreen) {
				APP.removeScreen(APP.previousScreen);
			}
			
			APP.previousScreen = _screen;
		}
	},
	/**
	 * Global function to remove a screen
	 */
	removeScreen: function(_screen) {
		if(_screen) {
			APP.ContentWrapper.remove(_screen);
			
			APP.previousScreen = null;
		}
	},
	/**
	 * Adds a screen to the Master window
	 */
	addMasterScreen: function(_screen) {
		if(_screen) {
			APP.Master[APP.currentStack].add(_screen);
		}
	},
	/**
	 * Adds a screen to the Detail window
	 */
	addDetailScreen: function(_screen) {
		if(_screen) {
			APP.Detail[APP.currentStack].add(_screen);
			
			if(APP.previousDetailScreen && APP.previousDetailScreen != _screen) {
				var pop = true;
				
				if(APP.detailStacks[APP.currentDetailStack][0].type == "PARENT" && _screen.type != "PARENT") {
					pop = false;
				}
				
				APP.removeDetailScreen(APP.previousDetailScreen, pop);
			}
			
			APP.previousDetailScreen = _screen;
		}
	},
	/**
	 * Removes a screen from the Detail window
	 */
	removeDetailScreen: function(_screen, _pop) {
		if(_screen) {
			APP.Detail[APP.currentStack].remove(_screen);
			
			APP.previousDetailScreen = null;
			
			if(_pop) {
				var stack = APP.detailStacks[APP.currentDetailStack];
				
				stack.splice(0, stack.length - 1);
			}
		}
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
		
		APP.addChild("settings", {}, "settings");
	},
	/**
	 * Registers the app for push notifications
	 */
	registerPush: function() {
		if(OS_IOS) {
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
					
					if(_event.data.tab) {
						var tabIndex = parseInt(_event.data.tab) - 1;
						
						if(APP.Nodes[tabIndex]) {
							APP.handleNavigation(tabIndex);
						}
					}
				}
			});
		}
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
				+ APP.Device.os + " " + APP.Device.version + " (" + APP.Device.name + ") " + Ti.Platform.locale + "\n\n"
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
	 * Global orientation event handler
	 * @param {Object} _event Standard Ti callback
	 */
	orientationObserver: function(_event) {
		APP.log("debug", "APP.orientationObserver");
		
		if(APP.Device.statusBarOrientation && APP.Device.statusBarOrientation == _event.orientation) {
			return;
		}
		
		APP.Device.statusBarOrientation = _event.orientation;
		
		APP.Device.orientation = (_event.orientation == Ti.UI.LANDSCAPE_LEFT || _event.orientation == Ti.UI.LANDSCAPE_RIGHT) ? "LANDSCAPE" : "PORTRAIT";

		Ti.App.fireEvent("APP:orientationChange");
	},
	/**
	 * Global network event handler
	 * @param {Object} _event Standard Ti callback
	 */
	networkObserver: function(_event) {
		APP.log("debug", "APP.networkObserver");
		
		APP.Network.type	= _event.networkTypeName;
		APP.Network.online	= _event.online;
		
		Ti.App.fireEvent("APP:networkChange");
	},
	/**
	 * Exit event observer
	 */
	exitObserver: function() {
		APP.log("debug", "APP.exitObserver");
	},
	/**
	 * Resume event observer
	 */
	resumeObserver: function() {
		APP.log("debug", "APP.resumeObserver");
	}
};

module.exports = APP;
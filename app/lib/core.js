var Alloy = require("alloy");
var UTIL = require("utilities");
var HTTP = require("http");

var APP = {
	/**
	 * Holds data from the JSON config file
	 */
	ID: null,
	VERSION: null,
	CVERSION: "1.2.0.100513",
	LEGAL: {
		COPYRIGHT: null,
		TOS: null,
		PRIVACY: null
	},
	ConfigurationURL: null,
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
		versionMajor: parseInt(Titanium.Platform.version.split(".")[0], 10),
		versionMinor: parseInt(Titanium.Platform.version.split(".")[1], 10),
		width: Ti.Platform.displayCaps.platformWidth > Ti.Platform.displayCaps.platformHeight ? Ti.Platform.displayCaps.platformHeight : Ti.Platform.displayCaps.platformWidth,
		height: Ti.Platform.displayCaps.platformWidth > Ti.Platform.displayCaps.platformHeight ? Ti.Platform.displayCaps.platformWidth : Ti.Platform.displayCaps.platformHeight,
		dpi: Ti.Platform.displayCaps.dpi,
		orientation: Ti.Gesture.orientation == Ti.UI.LANDSCAPE_LEFT || Ti.Gesture.orientation == Ti.UI.LANDSCAPE_RIGHT ? "LANDSCAPE" : "PORTRAIT",
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
	 */
	currentStack: -1,
	previousScreen: null,
	controllerStacks: [],
	modalStack: [],
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
	 */
	GlobalWrapper: null,
	/**
	 * The global view all content screen controllers get added to
	 */
	ContentWrapper: null,
	/**
	 * Holder for ACS cloud module
	 */
	ACS: null,
	/**
	 * The loading view
	 */
	Loading: Alloy.createWidget("com.chariti.loading").getView(),
	cancelLoading: false,
	loadingOpen: false,
	/**
	 * Tabs Widget
	 */
	Tabs: null,
	/**
	 * Slide Menu Widget
	 */
	SlideMenu: null,
	SlideMenuOpen: false,
	SlideMenuEngaged: true,
	/**
	 * Initializes the application
	 */
	init: function() {
		Ti.API.debug("APP.init");

		// Global system Events
		Ti.Network.addEventListener("change", APP.networkObserver);
		Ti.Gesture.addEventListener("orientationchange", APP.orientationObserver);
		Ti.App.addEventListener("pause", APP.exitObserver);
		Ti.App.addEventListener("close", APP.exitObserver);
		Ti.App.addEventListener("resumed", APP.resumeObserver);

		if(OS_ANDROID) {
			APP.MainWindow.addEventListener("androidback", APP.backButtonObserver);
		}

		// Determine device characteristics
		APP.determineDevice();

		// Migrate to newer ChariTi version
		require("migrate").init();

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

		// NOTICE
		// The following sections are abstracted for PEEK

		// Updates the app from a remote source
		APP.update();

		// Set up ACS
		APP.initACS();

		// Set up push notifications
		APP.initPush();
	},
	/**
	 * Determines the device characteristics
	 */
	determineDevice: function() {
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
			APP.Device.width = (APP.Device.width / (APP.Device.dpi / 160));
			APP.Device.height = (APP.Device.height / (APP.Device.dpi / 160));
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
	 * Drops the entire database
	 */
	dropDatabase: function() {
		Ti.API.debug("APP.dropDatabase");

		var db = Ti.Database.open("ChariTi");
		db.remove();
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

			if(contentFile.exists()) {
				content = contentFile.read();
				data = JSON.parse(content.text);
			} else {
				APP.log("error", "Unable to parse local JSON, dying");

				alert("Unable to open the application");

				return;
			}
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

		for(var i = 0, x = APP.Nodes.length; i < x; i++) {
			APP.Nodes[i].index = i;
		}

		if(typeof APP.Settings.useSlideMenu == "undefined") {
			APP.Settings.useSlideMenu = false;
		}
	},
	/**
	 * Builds out the tab group
	 * @param {Boolean} [_rebuild] Whether this is a re-build or not
	 */
	build: function(_rebuild) {
		APP.log("debug", "APP.build");

		var tabs = [];

		for(var i = 0, x = APP.Nodes.length; i < x; i++) {
			tabs.push({
				id: i,
				title: APP.Nodes[i].title,
				image: "/icons/" + APP.Nodes[i].image + ".png",
				controller: APP.Nodes[i].type.toLowerCase(),
				menuHeader: APP.Nodes[i].menuHeader
			});
		}

		if(APP.Settings.useSlideMenu) {
			APP.buildMenu(tabs, _rebuild);
		} else {
			APP.buildTabs(tabs, _rebuild);
		}
	},
	/**
	 * Builds a TabGroup
	 * @param {Array} [_tabs] The tabs to build
	 * @param {Boolean} [_rebuild] Whether this is a re-build or not
	 */
	buildTabs: function(_tabs, _rebuild) {
		APP.log("debug", "APP.buildTabs");

		APP.Tabs.init({
			tabs: _tabs,
			colors: {
				primary: APP.Settings.colors.primary,
				secondary: APP.Settings.colors.secondary,
				text: APP.Settings.colors.text
			}
		});

		if(!_rebuild) {
			// Add a handler for the tabs
			APP.Tabs.Wrapper.addEventListener("click", function(_event) {
				if(typeof _event.source.id !== "undefined" && typeof _event.source.id == "number") {
					APP.handleNavigation(_event.source.id);
				}
			});
		}
	},
	/**
	 * Builds a slide menu
	 * @param {Array} [_tabs] The tabs to build
	 * @param {Boolean} [_rebuild] Whether this is a re-build or not
	 */
	buildMenu: function(_tabs, _rebuild) {
		APP.log("debug", "APP.buildMenu");

		APP.SlideMenu.init({
			tabs: _tabs
		});

		// Remove the TabGroup
		APP.GlobalWrapper.remove(APP.Tabs.Wrapper);

		// Move everything down to take up the TabGroup space
		APP.ContentWrapper.bottom = "0dp";

		if(!_rebuild) {
			// Add a handler for the tabs
			APP.SlideMenu.Tabs.addEventListener("click", function(_event) {
				if(typeof _event.row.id !== "undefined" && typeof _event.row.id == "number") {
					APP.closeSettings();

					APP.handleNavigation(_event.row.id);
				} else if(typeof _event.row.id !== "undefined" && _event.row.id == "settings") {
					APP.openSettings();
				}

				APP.toggleMenu();
			});
		}

		// Listen for gestures on the main window to open/close the slide menu
		APP.GlobalWrapper.addEventListener("swipe", function(_event) {
			if(APP.SlideMenuEngaged) {
				if(_event.direction == "right") {
					APP.openMenu();
				} else if(_event.direction == "left") {
					APP.closeMenu();
				}
			}
		});
	},
	/**
	 * Re-builds the app with newly downloaded JSON configration file
	 */
	rebuild: function() {
		APP.log("debug", "APP.rebuild");

		APP.SlideMenu.clear();
		APP.Tabs.clear();

		// Undo removal of TabGroup
		APP.GlobalWrapper.add(APP.Tabs.Wrapper);
		APP.ContentWrapper.bottom = "60dp";

		APP.currentStack = -1;
		APP.previousScreen = null;
		APP.controllerStacks = [];
		APP.modalStack = [];
		APP.hasDetail = false;
		APP.currentDetailStack = -1;
		APP.previousDetailScreen = null;
		APP.detailStacks = [];
		APP.Master = [];
		APP.Detail = [];
		APP.cancelLoading = false;
		APP.loadingOpen = false;

		// NOTICE
		// The following section is abstracted for PEEK

		APP.rebuildRestart();
	},
	/**
	 * Kicks off the newly re-built application
	 */
	rebuildRestart: function() {
		APP.log("debug", "APP.rebuildRestart");

		APP.dropDatabase();
		APP.setupDatabase();
		APP.loadContent();
		APP.build(true);
		APP.handleNavigation(0);
	},
	/**
	 * Updates the app from a remote source
	 */
	update: function() {
		require("update").init();
	},

	/**
	 * Set up ACS
	 */
	initACS: function() {
		APP.log("debug", "APP.initACS");

		APP.ACS = require("ti.cloud");
	},
	/**
	 * Set up push notifications
	 */
	initPush: function() {
		APP.log("debug", "APP.initPush");

		if(APP.Settings.notifications.enabled) {
			require("push").init();
		}
	},
	/**
	 * Global event handler to change screens
	 * @param {String} [_id] The ID (index) of the tab being opened
	 */
	handleNavigation: function(_id) {
		APP.log("debug", "APP.handleNavigation | " + APP.Nodes[_id].type);

		// Requesting same screen as we're on
		if(_id == APP.currentStack) {
			// Do nothing
			return;
		} else {
			if(APP.Settings.useSlideMenu) {
				// Select the row for the requested item
				APP.SlideMenu.setIndex(_id);
			} else {
				// Move the tab selection indicator
				APP.Tabs.setIndex(_id);
			}

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

				// Tell the parent screen it was added to the window
				if(controllerStack[0].type == "tablet") {
					controllerStack[0].fireEvent("APP:tabletScreenAdded");
				} else {
					controllerStack[0].fireEvent("APP:screenAdded");
				}
			} else {
				// Create a new screen
				var type = APP.Nodes[_id].type.toLowerCase();
				var tabletSupport = APP.Nodes[_id].tabletSupport;

				// TODO: Remove this. Find other way to determine if tablet version is available
				if(APP.Device.isTablet) {
					if(tabletSupport) {
						type = "tablet";
						APP.hasDetail = true;
					} else {
						switch(type) {
							case "article":
							case "event":
							case "facebook":
							case "flickr":
							case "podcast":
							case "share":
							case "vimeo":
							case "youtube":
								type = "tablet";
								APP.hasDetail = true;
								break;
						}
					}
				}

				screen = Alloy.createController(type, APP.Nodes[_id]).getView();

				// Add screen to the controller stack
				controllerStack.push(screen);

				// Tell the screen it was added to the window
				if(screen.type == "tablet") {
					screen.fireEvent("APP:tabletScreenAdded");
				} else {
					screen.fireEvent("APP:screenAdded");
				}
			}

			// Add the screen to the window
			APP.addScreen(screen);

			// Reset the modal stack
			APP.modalStack = [];
		}
	},
	/**
	 * Open a child screen
	 * @param {String} [_controller] The name of the controller to open
	 * @param {Object} [_params] An optional dictionary of parameters to pass to the controller
	 * @param {Boolean} [_modal] Whether this is for the modal stack
	 * @param {Boolean} [_sibling] Whether this is a sibling view
	 */
	addChild: function(_controller, _params, _modal, _sibling) {
		var stack;

		// Determine if stack is associated with a tab
		if(_modal) {
			stack = APP.modalStack;
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

		if(_sibling) {
			stack.splice(stack.length - 2, 1);
		}

		// Add the screen to the window
		if(APP.Device.isHandheld || !APP.hasDetail || _modal) {
			APP.addScreen(screen);
		} else {
			APP.addDetailScreen(screen);
		}
	},
	/**
	 * Removes a child screen
	 * @param {Boolean} [_modal] Removes the child from the modal stack
	 */
	removeChild: function(_modal) {
		var stack;

		if(_modal) {
			stack = APP.modalStack;
		} else {
			if(APP.Device.isTablet && APP.hasDetail) {
				stack = APP.detailStacks[APP.currentDetailStack];
			} else {
				stack = APP.controllerStacks[APP.currentStack];
			}
		}

		var screen = stack[stack.length - 1];
		var previousStack;
		var previousScreen;

		stack.pop();

		if(stack.length === 0) {
			previousStack = APP.controllerStacks[APP.currentStack];

			if(APP.Device.isHandheld || !APP.hasDetail) {
				previousScreen = previousStack[previousStack.length - 1];

				APP.addScreen(previousScreen);
			} else {
				previousScreen = previousStack[0];

				if(_modal) {
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
				if(_modal) {
					APP.addScreen(previousScreen);
				} else {
					APP.addDetailScreen(previousScreen);
				}
			}
		}
	},
	/**
	 * Removes all children screens
	 * @param {Boolean} [_modal] Removes all children from the modal stack
	 */
	removeAllChildren: function(_modal) {
		var stack = _modal ? APP.modalStack : APP.controllerStacks[APP.currentStack];

		for(var i = stack.length - 1; i > 0; i--) {
			stack.pop();
		}

		APP.addScreen(stack[0]);
	},
	/**
	 * Global function to add a screen
	 * @param {Object} [_screen] The screen to add
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
	 * @param {Object} [_screen] The screen to remove
	 */
	removeScreen: function(_screen) {
		if(_screen) {
			APP.ContentWrapper.remove(_screen);

			APP.previousScreen = null;
		}
	},
	/**
	 * Adds a screen to the Master window
	 * @param {String} [_controller] The name of the controller to open
	 * @param {Object} [_params] An optional dictionary of parameters to pass to the controller
	 * @param {Object} [_wrapper] The parent wrapper screen to fire events to
	 */
	addMasterScreen: function(_controller, _params, _wrapper) {
		var screen = Alloy.createController(_controller, _params).getView();

		_wrapper.addEventListener("APP:tabletScreenAdded", function(_event) {
			screen.fireEvent("APP:screenAdded");
		});

		APP.Master[APP.currentStack].add(screen);
	},
	/**
	 * Adds a screen to the Detail window
	 * @param {Object} [_screen] The screen to add
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
	 * @param {Object} [_screen] The screen to remove
	 * @param {Boolean} [_pop] Whether to pop the item off the controller stack
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
	 * Opens the Settings window
	 */
	openSettings: function() {
		APP.log("debug", "APP.openSettings");

		APP.addChild("settings", {}, true);
	},
	/**
	 * Closes all non-tab stacks
	 */
	closeSettings: function() {
		if(APP.modalStack.length > 0) {
			APP.removeChild(true);
		}
	},
	/**
	 * Toggles the Slide Menu
	 */
	toggleMenu: function(_position) {
		if(APP.SlideMenuOpen) {
			APP.closeMenu();
		} else {
			APP.openMenu();
		}
	},
	/**
	 * Opens the Slide Menu
	 */
	openMenu: function() {
		APP.SlideMenu.Wrapper.left = "0dp";

		APP.GlobalWrapper.animate({
			left: "200dp",
			duration: 250,
			curve: Ti.UI.ANIMATION_CURVE_EASE_IN_OUT
		});

		APP.SlideMenuOpen = true;
	},
	/**
	 * Closes the Slide Menu
	 */
	closeMenu: function() {
		APP.GlobalWrapper.animate({
			left: "0dp",
			duration: 250,
			curve: Ti.UI.ANIMATION_CURVE_EASE_IN_OUT
		});

		APP.SlideMenuOpen = false;
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
	 * Logs all console data
	 * @param {String} _severity A severity type (debug, error, info, log, trace, warn)
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

		var db = Ti.Database.open("ChariTi");

		var time = new Date().getTime();
		var type = UTIL.escapeString(_severity);
		var message = UTIL.escapeString(_text);

		db.execute("UPDATE log SET time = " + time + ", type = " + type + ", message = " + message + " WHERE time = (SELECT min(time) FROM log);");
		db.close();
	},
	/**
	 * Sends the log files via e-mail dialog
	 */
	logSend: function() {
		var db = Ti.Database.open("ChariTi");
		var data = db.execute("SELECT * FROM log WHERE message != \"\" ORDER BY time DESC;");

		var log = "\n\n=====\n\n" + APP.ID + " " + APP.VERSION + " (" + APP.CVERSION + ")\n" + APP.Device.os + " " + APP.Device.version + " (" + APP.Device.name + ") " + Ti.Platform.locale + "\n\n";

		while(data.isValidRow()) {
			log += "[" + data.fieldByName("type") + "] " + data.fieldByName("message") + "\n";

			data.next();
		}

		log += "\n=====";

		data.close();
		db.close();

		var email = Ti.UI.createEmailDialog({
			barColor: APP.Settings.colors.primary || "#000",
			subject: "Application Log",
			messageBody: log
		});

		if(email.isSupported) {
			email.open();
		}
	},
	/**
	 * Global orientation event handler
	 * @param {Object} _event Standard Titanium event callback
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
	 * @param {Object} _event Standard Titanium event callback
	 */
	networkObserver: function(_event) {
		APP.log("debug", "APP.networkObserver");

		APP.Network.type = _event.networkTypeName;
		APP.Network.online = _event.online;

		Ti.App.fireEvent("APP:networkChange");
	},
	/**
	 * Exit event observer
	 * @param {Object} _event Standard Titanium event callback
	 */
	exitObserver: function(_event) {
		APP.log("debug", "APP.exitObserver");
	},
	/**
	 * Resume event observer
	 * @param {Object} _event Standard Titanium event callback
	 */
	resumeObserver: function(_event) {
		APP.log("debug", "APP.resumeObserver");
	},
	/**
	 * Back button observer
	 * @param {Object} _event Standard Titanium event callback
	 */
	backButtonObserver: function(_event) {
		APP.log("debug", "APP.backButtonObserver");

		if(APP.modalStack.length > 0) {
			APP.removeChild(true);

			return;
		} else {
			var stack;

			if(APP.Device.isHandheld || !APP.hasDetail) {
				stack = APP.controllerStacks[APP.currentStack];
			} else {
				stack = APP.detailStacks[APP.currentDetailStack];
			}

			if(stack.length > 1) {
				APP.removeChild();
			} else {
				APP.MainWindow.close();
			}
		}
	}
};

module.exports = APP;
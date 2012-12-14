// Pull in the core APP singleton
var APP = require("core");

// Make sure we always have a reference to global elements throughout the APP singleton
APP.MainWindow = $.MainWindow;
APP.GlobalWrapper = $.GlobalWrapper;
APP.ContentWrapper = $.ContentWrapper;
APP.Tabs = $.Tabs;

// Open the main window
APP.MainWindow.open();

// Start the APP
APP.init();

// The initial screen to show
APP.handleNavigation(0);
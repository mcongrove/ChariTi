/**
 * Controller for the PDF screen
 * 
 * @class Controllers.pdf
 * @uses core
 * @uses http
 */
var APP = require("core");
var HTTP = require("http");

var CONFIG = arguments[0];

/**
 * Initializes the controller
 */
$.init = function() {
	APP.log("debug", "pdf.init | " + JSON.stringify(CONFIG));

	if(!$.fileExists(CONFIG.url)) {
		HTTP.request({
			timeout: 10000,
			type: "GET",
			format: "DATA",
			url: CONFIG.url,
			success: $.handlePdf
		});
	} else {
		$.container.url = Ti.Filesystem.applicationDataDirectory + $.getFileName(CONFIG.url);
	}

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
 * Handles the PDF data return
 * @param {Object} _data The PDF data
 * @param {Object} _url The remote URL of the PDF
 */
$.handlePdf = function(_data, _url) {
	APP.log("debug", "pdf.handlePdf");

	var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, $.getFileName(_url));

	file.createFile();
	file.write(_data);

	$.container.url = Ti.Filesystem.applicationDataDirectory + $.getFileName(_url);
};

/**
 * Determines the filename based on the URL
 * @param {Object} _url The remote URL of the PDF
 */
$.getFileName = function(_url) {
	APP.log("debug", "pdf.getFileName");

	var match = _url.match(/[^/]*(?=\.pdf)/ig);
	var filename;

	if(match && match[0]) {
		filename = match[0];
	} else {
		filename = "temp";
	}

	return filename + ".pdf";
};

/**
 * Checks if the file exists locally
 * @param {Object} _url The remote URL of the PDF
 */
$.fileExists = function(_url) {
	APP.log("debug", "pdf.fileExists");

	var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, $.getFileName(_url));

	if(file.exists()) {
		return true;
	} else {
		return false;
	}
};

// Kick off the init
$.init();
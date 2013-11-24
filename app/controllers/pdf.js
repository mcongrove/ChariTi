/**
 * Controller for the PDF screen
 * 
 * @class Controllers.pdf
 * @uses core
 * @uses http
 */
var APP = require("core");
var UTIL = require("utilities");
var HTTP = require("http");

var CONFIG = arguments[0];

var filename;

/**
 * Initializes the controller
 */
$.init = function() {
	APP.log("debug", "pdf.init | " + JSON.stringify(CONFIG));

	filename = $.getFileName(CONFIG.url)

	if(!UTIL.fileExists(filename)) {
		HTTP.request({
			timeout: 10000,
			type: "GET",
			format: "DATA",
			url: CONFIG.url,
			success: $.handlePdf
		});
	} else {
		$.container.url = Ti.Filesystem.applicationDataDirectory + filename;
	}

	$.NavigationBar.setBackgroundColor(APP.Settings.colors.primary);

	if(CONFIG.isChild === true) {
		$.NavigationBar.showBack({
			callback: function(_event) {
				APP.removeChild();
			}
		});
	}

	if(APP.Settings.useSlideMenu) {
		$.NavigationBar.showMenu({
			callback: function(_event) {
				APP.toggleMenu();
			}
		});
	} else {
		$.NavigationBar.showSettings({
			callback: function(_event) {
				APP.openSettings();
			}
		});
	}
};

/**
 * Handles the PDF data return
 * @param {Object} _data The PDF data
 * @param {Object} _url The remote URL of the PDF
 */
$.handlePdf = function(_data, _url) {
	APP.log("debug", "pdf.handlePdf");

	var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, filename);

	file.createFile();
	file.write(_data);

	$.container.url = Ti.Filesystem.applicationDataDirectory + filename;
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

// Kick off the init
$.init();
var APP = require("core");
var HTTP = require("http");

var CONFIG = arguments[0];

$.init = function() {
	APP.log("debug", "pdf.init | " + JSON.stringify(CONFIG));

	$.NavigationBar.Wrapper.backgroundColor = APP.Settings.colors.primary || "#000";
	$.NavigationBar.right.visible			= true;
	$.NavigationBar.rightImage.image		= "/images/settings.png";

	if(CONFIG.isChild === true) {
		$.NavigationBar.back.visible		= true;
	}
	
	if(!$.fileExists(CONFIG.url)) {
		HTTP.request({
			timeout: 10000,
			type: "GET",
			format: "DATA",
			url: CONFIG.url,
			success: $.handlePdf
		});
	} else {
		$.content.url = Ti.Filesystem.applicationDataDirectory + $.getFileName(CONFIG.url);
	}
};

$.handlePdf = function(_data, _url) {
	APP.log("debug", "pdf.handlePdf");
	
	var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, $.getFileName(_url));
	
	file.createFile();
	file.write(_data);
	
	$.content.url = Ti.Filesystem.applicationDataDirectory + $.getFileName(_url);
};

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

$.fileExists = function(_url) {
	APP.log("debug", "pdf.fileExists");
	
	var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, $.getFileName(_url));
	
	if(file.exists()) {
		return true;
	} else {
		return false;
	}
};

// Event listeners
$.NavigationBar.back.addEventListener("click", function(_event) {
	APP.log("debug", "pdf @close");
	
	APP.removeChild();
});

$.NavigationBar.right.addEventListener("click", function(_event) {
	APP.openSettings();
});

// Kick off the init
$.init();
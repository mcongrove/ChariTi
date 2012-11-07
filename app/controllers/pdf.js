var HTTP = require("http");

var CONFIG = arguments[0];

$.init = function() {
	if(!$.fileExists(CONFIG.url)) {
		HTTP.request({
			timeout: 10000,
			type: "GET",
			format: "DATA",
			url: CONFIG.url,
			success: $.handlePdf
		});
	} else {
		$.Wrapper.url = Ti.Filesystem.applicationDataDirectory + $.getFileName(CONFIG.url);
	}
};

$.handlePdf = function(_data, _url) {
	var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, $.getFileName(_url));
	
	file.createFile();
	file.write(_data);
	
	$.Wrapper.url = Ti.Filesystem.applicationDataDirectory + $.getFileName(_url);
};

$.getFileName = function(_url) {
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
	var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, $.getFileName(_url));
	
	if(file.exists()) {
		return true;
	} else {
		return false;
	}
};

// Kick off the init
$.init();
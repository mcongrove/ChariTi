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
	return _url.match(/[^/]*(?=\.pdf)/ig)[0] + ".pdf";
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
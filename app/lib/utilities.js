/**
 * Checks to see if an item in the cache is stale or fresh
 * @param {String} [_url] The URL of the file we're checking
 * @param {Integer} [_time] The time, in minutes, to consider 'warm' in the cache
 */
exports.isStale = function(_url, _time) {
	var db = Ti.Database.open("ChariTi");
	var time = new Date().getTime();
	var cacheTime = typeof _time !== "undefined" ? _time : 5;
	var freshTime = time - (cacheTime * 60 * 1000);
	var lastUpdate = 0;

	var data = db.execute("SELECT time FROM updates WHERE url = " + exports.escapeString(_url) + " ORDER BY time DESC LIMIT 1;");

	while(data.isValidRow()) {
		lastUpdate = data.fieldByName("time");

		data.next();
	}

	data.close();
	db.close();

	if(lastUpdate === 0) {
		return "new";
	} else if(lastUpdate > freshTime) {
		return false;
	} else {
		return true;
	}
};

/**
 * Returns last updated time for an item in the cache
 * @param {String} [_url] The URL of the file we're checking
 */
exports.lastUpdate = function(_url) {
	var db = Ti.Database.open("ChariTi");
	var lastUpdate = 0;

	var data = db.execute("SELECT time FROM updates WHERE url = " + exports.escapeString(_url) + " ORDER BY time DESC LIMIT 1;");

	while(data.isValidRow()) {
		lastUpdate = data.fieldByName("time");

		data.next();
	}

	data.close();
	db.close();

	if(lastUpdate === 0) {
		return new Date().getTime();
	} else {
		return lastUpdate;
	}
};

/**
 * Escapes a string for SQL insertion
 * @param {String} [_string] The string to perform the action on
 */
exports.escapeString = function(_string) {
	if(typeof _string !== "string") {
		return "\"" + _string + "\"";
	}

	return "\"" + _string.replace(/"/g, "'") + "\"";
};

/**
 * Removes HTML entities, replaces breaks/paragraphs with newline, strips HTML, trims
 * @param {String} [_string] The string to perform the action on
 */
exports.cleanString = function(_string) {
	if(typeof _string !== "string") {
		return _string;
	}

	_string = _string.replace(/&amp;*/ig, "&");
	_string = exports.htmlDecode(_string);
	_string = _string.replace(/\s*<br[^>]*>\s*/ig, "\n");
	_string = _string.replace(/\s*<\/p>*\s*/ig, "\n\n");
	_string = _string.replace(/<a[^h]*href=["']{1}([^'"]*)["']{1}>([^<]*)<\/a>/ig, "$2 [$1]");
	_string = _string.replace(/<[^>]*>/g, "");
	_string = _string.replace(/\s*\n{3,}\s*/g, "\n\n");
	_string = _string.replace(/[^\S\n]{2,}/g, " ");
	_string = _string.replace(/\n[^\S\n]*/g, "\n");
	_string = _string.replace(/^\s+|\s+$/g, "");

	return _string;
};

/**
 * Combination of clean and escape string
 * @param {String} [_string] The string to perform the action on
 */
exports.cleanEscapeString = function(_string) {
	_string = exports.cleanString(_string);

	return exports.escapeString(_string);
};

/**
 * Cleans up nasty XML
 * @param {String} [_string] The XML string to perform the action on
 */
exports.xmlNormalize = function(_string) {
	_string = _string.replace(/&nbsp;*/ig, " ");
	_string = _string.replace(/&(?!amp;)\s*/g, "&amp;");
	_string = _string.replace(/^\s+|\s+$/g, "");
	_string = _string.replace(/<title>(?!<!\[CDATA\[)/ig, "<title><![CDATA[");
	_string = _string.replace(/<description>(?!<!\[CDATA\[)/ig, "<description><![CDATA[");
	_string = _string.replace(/(\]\]>)?<\/title>/ig, "]]></title>");
	_string = _string.replace(/(\]\]>)?<\/description>/ig, "]]></description>");

	return _string;
};

/**
 * Converts a hex unicode character into a normal character
 */
String.fromCharCodePoint = function() {
	var codeunits = [];
	
	for(var i = 0; i < arguments.length; i++) {
		var c = arguments[i];
		
		if(arguments[i] < 0x10000) {
			codeunits.push(arguments[i]);
		} else if(arguments[i] < 0x110000) {
			c -= 0x10000;
			codeunits.push((c >> 10 & 0x3FF) + 0xD800);
			codeunits.push((c & 0x3FF) + 0xDC00);
		}
	}
	
	return String.fromCharCode.apply(String, codeunits);
};

/**
 * Decodes HTML entities
 * @param {String} [_string] The string to perform the action on
 */
exports.htmlDecode = function(_string) {
	return _string.replace(/&#(\d+);/g, function(_, n) {;
		return String.fromCharCodePoint(parseInt(n, 10));
	}).replace(/&#x([0-9a-f]+);/gi, function(_, n) {
		return String.fromCharCodePoint(parseInt(n, 16));
	});
};

/**
 * Adds thousands separators to a number
 * @param {Integer} [_number] The number to perform the action on
 */
exports.formatNumber = function(_number) {
	_number = _number + "";

	x = _number.split(".");
	x1 = x[0];
	x2 = x.length > 1 ? "." + x[1] : "";

	var expression = /(\d+)(\d{3})/;

	while(expression.test(x1)) {
		x1 = x1.replace(expression, "$1" + "," + "$2");
	}

	return x1 + x2;
};
/**
 * Escapes a string for SQL insertion
 */
exports.escapeString = function(_string) {
	if(typeof _string !== "string") {
		return "\"" + _string + "\"";
	}
	
	return "\"" + _string.replace(/"/g, "'") + "\"";
};

/**
 * Removes HTML entities, replaces breaks/paragraphs with newline, strips HTML, trims
 */
exports.cleanString = function(_string) {
	if(typeof _string !== "string") {
		return _string;
	}
	
	_string = _string.replace(/&amp;*/ig, "&");
	_string = exports.htmlDecode(_string);
	_string = _string.replace(/\s*<br[^>]*>\s*/ig, "\n");
	_string = _string.replace(/\s*<\/p>*\s*/ig, "\n\n");
	_string = _string.replace(/<[^>]*>/g, "");
	_string = _string.replace(/\s*\n{3,}\s*/g, "\n\n");
	_string = _string.replace(/[^\S\n]{2,}/g, " ");
	_string = _string.replace(/\n[^\S\n]*/g, "\n");
	_string = _string.replace(/^\s+|\s+$/g, "");
	
	return _string;
};

/**
 * Combination of clean and escape string
 */
exports.cleanEscapeString = function(_string) {
	_string = exports.cleanString(_string);
	
	return exports.escapeString(_string);
};

/**
 * Cleans up nasty XML
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
 * Decodes HTML entities
 */
exports.htmlDecode = function(_string) {
	var tmp_str = _string.toString();
	var hash_map = exports.htmlTranslationTable();
	var results = tmp_str.match(/&#\d*;/ig);
	
	if(results) {
		for(var i = 0, x = results.length; i < x; i++) {
			var code = parseInt(results[i].replace("&#", "").replace(";", ""), 10);
			
			hash_map[results[i]] = code;
		}
	}
	
	for(var entity in hash_map) {
		var symbol = String.fromCharCode(hash_map[entity]);
		
		tmp_str = tmp_str.split(entity).join(symbol);
	}
	
	return tmp_str;
};

exports.htmlTranslationTable = function() {
	var entities = {};
	
	entities["&amp;"] = "38";
	entities["&bdquo;"] = "8222";
	entities["&bull;"] = "8226";
	entities["&circ;"] = "710";
	entities["&dagger;"] = "8224";
	entities["&Dagger;"] = "8225";
	entities["&fnof;"] = "402";
	entities["&hellip;"] = "8230";
	entities["&ldquo;"] = "8220";
	entities["&lsaquo;"] = "8249";
	entities["&lsquo;"] = "8216";
	entities["&mdash;"] = "8212";
	entities["&ndash;"] = "8211";
	entities["&OElig;"] = "338";
	entities["&oelig;"] = "339";
	entities["&permil;"] = "8240";
	entities["&rdquo;"] = "8221";
	entities["&rsaquo;"] = "8250";
	entities["&rsquo;"] = "8217";
	entities["&sbquo;"] = "8218";
	entities["&scaron;"] = "353";
	entities["&Scaron;"] = "352";
	entities["&tilde;"] = "152";
	entities["&trade;"] = "8482";
	entities["&Yuml;"] = "376";
	entities["&Igrave;"] = "204";
	entities["&igrave;"] = "236";
	entities["&Iota;"] = "921";
	entities["&iota;"] = "953";
	entities["&Iuml;"] = "207";
	entities["&iuml;"] = "239";
	entities["&larr;"] = "8592";
	entities["&lArr;"] = "8656";
	entities["&Aacute;"] = "193";
	entities["&aacute;"] = "225";
	entities["&Acirc;"] = "194";
	entities["&acirc;"] = "226";
	entities["&acute;"] = "180";
	entities["&AElig;"] = "198";
	entities["&aelig;"] = "230";
	entities["&Agrave;"] = "192";
	entities["&agrave;"] = "224";
	entities["&alefsym;"] = "8501";
	entities["&Alpha;"] = "913";
	entities["&alpha;"] = "945";
	entities["&and;"] = "8743";
	entities["&ang;"] = "8736";
	entities["&Aring;"] = "197";
	entities["&aring;"] = "229";
	entities["&asymp;"] = "8776";
	entities["&Atilde;"] = "195";
	entities["&atilde;"] = "227";
	entities["&Auml;"] = "196";
	entities["&auml;"] = "228";
	entities["&Beta;"] = "914";
	entities["&beta;"] = "946";
	entities["&brvbar;"] = "166";
	entities["&cap;"] = "8745";
	entities["&Ccedil;"] = "199";
	entities["&ccedil;"] = "231";
	entities["&cedil;"] = "184";
	entities["&cent;"] = "162";
	entities["&Chi;"] = "935";
	entities["&chi;"] = "967";
	entities["&clubs;"] = "9827";
	entities["&cong;"] = "8773";
	entities["&copy;"] = "169";
	entities["&crarr;"] = "8629";
	entities["&cup;"] = "8746";
	entities["&curren;"] = "164";
	entities["&darr;"] = "8595";
	entities["&dArr;"] = "8659";
	entities["&deg;"] = "176";
	entities["&Delta;"] = "916";
	entities["&delta;"] = "948";
	entities["&diams;"] = "9830";
	entities["&divide;"] = "247";
	entities["&Eacute;"] = "201";
	entities["&eacute;"] = "233";
	entities["&Ecirc;"] = "202";
	entities["&ecirc;"] = "234";
	entities["&Egrave;"] = "200";
	entities["&egrave;"] = "232";
	entities["&empty;"] = "8709";
	entities["&emsp;"] = "8195";
	entities["&ensp;"] = "8194";
	entities["&Epsilon;"] = "917";
	entities["&epsilon;"] = "949";
	entities["&equiv;"] = "8801";
	entities["&Eta;"] = "919";
	entities["&eta;"] = "951";
	entities["&ETH;"] = "208";
	entities["&eth;"] = "240";
	entities["&Euml;"] = "203";
	entities["&euml;"] = "235";
	entities["&euro;"] = "8364";
	entities["&exist;"] = "8707";
	entities["&forall;"] = "8704";
	entities["&frac12;"] = "189";
	entities["&frac14;"] = "188";
	entities["&frac34;"] = "190";
	entities["&frasl;"] = "8260";
	entities["&Gamma;"] = "915";
	entities["&gamma;"] = "947";
	entities["&ge;"] = "8805";
	entities["&harr;"] = "8596";
	entities["&hArr;"] = "8660";
	entities["&hearts;"] = "9829";
	entities["&Iacute;"] = "205";
	entities["&iacute;"] = "237";
	entities["&Icirc;"] = "206";
	entities["&icirc;"] = "238";
	entities["&iexcl;"] = "161";
	entities["&image;"] = "8465";
	entities["&infin;"] = "8734";
	entities["&int;"] = "8747";
	entities["&iquest;"] = "191";
	entities["&isin;"] = "8712";
	entities["&Kappa;"] = "922";
	entities["&kappa;"] = "954";
	entities["&Lambda;"] = "923";
	entities["&lambda;"] = "955";
	entities["&lang;"] = "9001";
	entities["&laquo;"] = "171";
	entities["&lceil;"] = "8968";
	entities["&le;"] = "8804";
	entities["&lfloor;"] = "8970";
	entities["&lowast;"] = "8727";
	entities["&loz;"] = "9674";
	entities["&lrm;"] = "8206";
	entities["&macr;"] = "175";
	entities["&micro;"] = "181";
	entities["&middot;"] = "183";
	entities["&minus;"] = "8722";
	entities["&Mu;"] = "924";
	entities["&mu;"] = "956";
	entities["&nabla;"] = "8711";
	entities["&nbsp;"] = "160";
	entities["&ne;"] = "8800";
	entities["&ni;"] = "8715";
	entities["&not;"] = "172";
	entities["&notin;"] = "8713";
	entities["&nsub;"] = "8836";
	entities["&Ntilde;"] = "209";
	entities["&ntilde;"] = "241";
	entities["&Nu;"] = "925";
	entities["&nu;"] = "957";
	entities["&Oacute;"] = "211";
	entities["&oacute;"] = "243";
	entities["&Ocirc;"] = "212";
	entities["&ocirc;"] = "244";
	entities["&Ograve;"] = "210";
	entities["&ograve;"] = "242";
	entities["&oline;"] = "8254";
	entities["&Omega;"] = "937";
	entities["&omega;"] = "969";
	entities["&Omicron;"] = "927";
	entities["&omicron;"] = "959";
	entities["&oplus;"] = "8853";
	entities["&or;"] = "8744";
	entities["&ordf;"] = "170";
	entities["&ordm;"] = "186";
	entities["&Oslash;"] = "216";
	entities["&oslash;"] = "248";
	entities["&Otilde;"] = "213";
	entities["&otilde;"] = "245";
	entities["&otimes;"] = "8855";
	entities["&Ouml;"] = "214";
	entities["&ouml;"] = "246";
	entities["&para;"] = "182";
	entities["&part;"] = "8706";
	entities["&perp;"] = "8869";
	entities["&Phi;"] = "934";
	entities["&phi;"] = "966";
	entities["&Pi;"] = "928";
	entities["&pi;"] = "960";
	entities["&piv;"] = "982";
	entities["&plusmn;"] = "177";
	entities["&pound;"] = "163";
	entities["&prime;"] = "8242";
	entities["&Prime;"] = "8243";
	entities["&prod;"] = "8719";
	entities["&prop;"] = "8733";
	entities["&Psi;"] = "936";
	entities["&psi;"] = "968";
	entities["&radic;"] = "8730";
	entities["&rang;"] = "9002";
	entities["&raquo;"] = "187";
	entities["&rarr;"] = "8594";
	entities["&rArr;"] = "8658";
	entities["&rceil;"] = "8969";
	entities["&real;"] = "8476";
	entities["&reg;"] = "174";
	entities["&rfloor;"] = "8971";
	entities["&Rho;"] = "929";
	entities["&rho;"] = "961";
	entities["&rlm;"] = "8207";
	entities["&sdot;"] = "8901";
	entities["&sect;"] = "167";
	entities["&shy;"] = "173";
	entities["&Sigma;"] = "931";
	entities["&sigma;"] = "963";
	entities["&sigmaf;"] = "962";
	entities["&sim;"] = "8764";
	entities["&spades;"] = "9824";
	entities["&sub;"] = "8834";
	entities["&sube;"] = "8838";
	entities["&sum;"] = "8721";
	entities["&sup;"] = "8835";
	entities["&sup1;"] = "185";
	entities["&sup2;"] = "178";
	entities["&sup3;"] = "179";
	entities["&supe;"] = "8839";
	entities["&szlig;"] = "223";
	entities["&Tau;"] = "932";
	entities["&tau;"] = "964";
	entities["&there4;"] = "8756";
	entities["&Theta;"] = "920";
	entities["&theta;"] = "952";
	entities["&thetasym;"] = "977";
	entities["&thinsp;"] = "8201";
	entities["&THORN;"] = "222";
	entities["&thorn;"] = "254";
	entities["&tilde;"] = "732";
	entities["&times;"] = "215";
	entities["&Uacute;"] = "218";
	entities["&uacute;"] = "250";
	entities["&uarr;"] = "8593";
	entities["&uArr;"] = "8657";
	entities["&Ucirc;"] = "219";
	entities["&ucirc;"] = "251";
	entities["&Ugrave;"] = "217";
	entities["&ugrave;"] = "249";
	entities["&uml;"] = "168";
	entities["&upsih;"] = "978";
	entities["&Upsilon;"] = "933";
	entities["&upsilon;"] = "965";
	entities["&Uuml;"] = "220";
	entities["&uuml;"] = "252";
	entities["&weierp;"] = "8472";
	entities["&Xi;"] = "926";
	entities["&xi;"] = "958";
	entities["&Yacute;"] = "221";
	entities["&yacute;"] = "253";
	entities["&yen;"] = "165";
	entities["&yuml;"] = "255";
	entities["&Zeta;"] = "918";
	entities["&zeta;"] = "950";
	entities["&zwj;"] = "8205";
	entities["&zwnj;"] = "8204";
	entities["&quot;"] = "34";
	entities["&lt;"] = "60";
	entities["&gt;"] = "62";

	return entities;
};

/**
 * Adds thousands separators to a number
 */
exports.formatNumber = function(_number) {
	_number = _number + "";
	
	x = _number.split(".");
	x1 = x[0];
	x2 = x.length > 1 ? "." + x[1] : "";
	
	var expression = /(\d+)(\d{3})/;
	
	while (expression.test(x1)) {
		x1 = x1.replace(expression, "$1" + "," + "$2");
	}
	
	return x1 + x2;
};

/**
 * Converts a date to absolute time (e.g. "May 2, 2011 12:00PM")
 */
exports.toDateAbsolute = function(_date) {
	var date = new Date();
	date.setTime(_date);
	var dateHour = date.getHours() > 11 ? date.getHours() - 12 : date.getHours();
	dateHour = dateHour == 0 ? 12 : dateHour;
	var dateMinutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
	var datePeriod = date.getHours() > 12 ? "PM" : "AM";
	var months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
	
	return months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear() + " " + dateHour + ":" + dateMinutes + datePeriod;
};

/**
 * Converts a date to relative time (e.g. "Yesterday 12:01PM")
 */
exports.toDateRelative = function(_date) {
	var date = new Date();
	date.setTime(_date);
	var now = new Date();
	var days = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ];
	var dateMonth = date.getMonth();
	var dateDate = date.getDate();
	var dateDay = days[date.getDay()];
	var dateYear = date.getFullYear();
	var dateHour = date.getHours() > 11 ? date.getHours() - 12 : date.getHours();
	dateHour = dateHour == 0 ? 12 : dateHour;
	var dateMinutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
	var datePeriod = date.getHours() > 12 ? "PM" : "AM";
	var nowMonth = now.getMonth();
	var nowDate = now.getDate();
	var nowYear = now.getFullYear();
	
	if(dateYear == nowYear && dateMonth == nowMonth) {
		if(dateDate == nowDate) {
			return "Today " + dateHour + ":" + dateMinutes + datePeriod;
		} else if(dateDate >= nowDate - 1) {
			return "Yesterday " + dateHour + ":" + dateMinutes + datePeriod;
		} else if(dateDate >= nowDate - 6) {
			return dateDay + " " + dateHour + ":" + dateMinutes + datePeriod;
		} else {
			return exports.toDateAbsolute(_date);
		}
	} else {
		return exports.toDateAbsolute(_date);
	}
};
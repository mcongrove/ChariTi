/**
 * Escapes a string for SQL insertion
 */
exports.escapeString = function(_string) {
	return "\"" + _string.replace(/"/g, "'") + "\"";
};

/**
 * Removes HTML entities, replaces breaks/paragraphs with newline, strips HTML, trims
 */
exports.cleanString = function(_string) {
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
	_string = exports.htmlDecode(_string);
	_string = _string.replace(/&nbsp;*/ig, " ");
	_string = _string.replace(/&\s*/g, "&amp;");
	_string = _string.replace(/^\s+|\s+$/g, "");
	_string = _string.replace(/<title>/ig, "<title><![CDATA[");
	_string = _string.replace(/<\/title>/ig, "]]></title>");
	_string = _string.replace(/<description>/ig, "<description><![CDATA[");
	_string = _string.replace(/<\/description>/ig, "]]></description>");
	
	return _string;
};

/**
 * Decodes HTML entities
 */
exports.htmlDecode = function(_string, _quote_style) {
	var hash_map = {};
	var symbol = "";
	var tmp_str = "";
	var entity = "";
	var tmp_str = _string.toString();

	if(false === (hash_map = exports.htmlTranslationTable("HTML_ENTITIES", _quote_style))) {
		return false;
	}
	
	delete(hash_map["&"]);
	hash_map["&"] = "&amp;";

	for(symbol in hash_map) {
		entity = hash_map[symbol];
		tmp_str = tmp_str.split(entity).join(symbol);
	}
	
	tmp_str = tmp_str.split("&#039;").join("'");

	return tmp_str;
};

exports.htmlTranslationTable = function(_table, _quote_style) {
	var entities = {};
	var hash_map = {};
	var decimal = 0;
	var symbol = "";
	var constMappingTable = {};
	var constMappingQuoteStyle = {};
	var useTable = {};
	var useQuoteStyle = {};
	
	constMappingTable[0] = "HTML_SPECIALCHARS";
	constMappingTable[1] = "HTML_ENTITIES";
	constMappingQuoteStyle[0] = "ENT_NOQUOTES";
	constMappingQuoteStyle[2] = "ENT_COMPAT";
	constMappingQuoteStyle[3] = "ENT_QUOTES";
	useTable = !isNaN(_table) ? constMappingTable[_table] : _table ? _table.toUpperCase() : "HTML_SPECIALCHARS";
	useQuoteStyle = !isNaN(_quote_style) ? constMappingQuoteStyle[_quote_style] : _quote_style ? _quote_style.toUpperCase() : "ENT_COMPAT";

	if(useTable !== "HTML_SPECIALCHARS" && useTable !== "HTML_ENTITIES") {
		return false;
	}

	entities["38"] = "&amp;";
	
	if(useTable === "HTML_ENTITIES") {
		entities["8222"] = "&bdquo;";
		entities["8226"] = "&bull;";
		entities["710"] = "&circ;";
		entities["8224"] = "&dagger;";
		entities["8225"] = "&Dagger;";
		entities["402"] = "&fnof;";
		entities["8230"] = "&hellip;";
		entities["8220"] = "&ldquo;";
		entities["8249"] = "&lsaquo;";
		entities["8216"] = "&lsquo;";
		entities["8212"] = "&mdash;";
		entities["8211"] = "&ndash;";
		entities["338"] = "&OElig;";
		entities["339"] = "&oelig;";
		entities["8240"] = "&permil;";
		entities["8221"] = "&rdquo;";
		entities["8250"] = "&rsaquo;";
		entities["8217"] = "&rsquo;";
		entities["8218"] = "&sbquo;";
		entities["353"] = "&scaron;";
		entities["352"] = "&Scaron;";
		entities["152"] = "&tilde;";
		entities["8482"] = "&trade;";
		entities["376"] = "&Yuml;";
		entities["204"] = "&Igrave;";
		entities["236"] = "&igrave;";
		entities["921"] = "&Iota;";
		entities["953"] = "&iota;";
		entities["207"] = "&Iuml;";
		entities["239"] = "&iuml;";
		entities["8592"] = "&larr;";
		entities["8656"] = "&lArr;";
		entities["264"] = "&#264;";
		entities["265"] = "&#265;";
		entities["372"] = "&#372;";
		entities["373"] = "&#373;";
		entities["374"] = "&#374;";
		entities["375"] = "&#375;";
		entities["8729"] = "&#8729;";
		entities["9642"] = "&#9642;";
		entities["9643"] = "&#9643;";
		entities["9702"] = "&#9702;";
		entities["193"] = "&Aacute;";
		entities["225"] = "&aacute;";
		entities["194"] = "&Acirc;";
		entities["226"] = "&acirc;";
		entities["180"] = "&acute;";
		entities["198"] = "&AElig;";
		entities["230"] = "&aelig;";
		entities["192"] = "&Agrave;";
		entities["224"] = "&agrave;";
		entities["8501"] = "&alefsym;";
		entities["913"] = "&Alpha;";
		entities["945"] = "&alpha;";
		entities["8743"] = "&and;";
		entities["8736"] = "&ang;";
		entities["197"] = "&Aring;";
		entities["229"] = "&aring;";
		entities["8776"] = "&asymp;";
		entities["195"] = "&Atilde;";
		entities["227"] = "&atilde;";
		entities["196"] = "&Auml;";
		entities["228"] = "&auml;";
		entities["914"] = "&Beta;";
		entities["946"] = "&beta;";
		entities["166"] = "&brvbar;";
		entities["8745"] = "&cap;";
		entities["199"] = "&Ccedil;";
		entities["231"] = "&ccedil;";
		entities["184"] = "&cedil;";
		entities["162"] = "&cent;";
		entities["935"] = "&Chi;";
		entities["967"] = "&chi;";
		entities["9827"] = "&clubs;";
		entities["8773"] = "&cong;";
		entities["169"] = "&copy;";
		entities["8629"] = "&crarr;";
		entities["8746"] = "&cup;";
		entities["164"] = "&curren;";
		entities["8595"] = "&darr;";
		entities["8659"] = "&dArr;";
		entities["176"] = "&deg;";
		entities["916"] = "&Delta;";
		entities["948"] = "&delta;";
		entities["9830"] = "&diams;";
		entities["247"] = "&divide;";
		entities["201"] = "&Eacute;";
		entities["233"] = "&eacute;";
		entities["202"] = "&Ecirc;";
		entities["234"] = "&ecirc;";
		entities["200"] = "&Egrave;";
		entities["232"] = "&egrave;";
		entities["8709"] = "&empty;";
		entities["8195"] = "&emsp;";
		entities["8194"] = "&ensp;";
		entities["917"] = "&Epsilon;";
		entities["949"] = "&epsilon;";
		entities["8801"] = "&equiv;";
		entities["919"] = "&Eta;";
		entities["951"] = "&eta;";
		entities["208"] = "&ETH;";
		entities["240"] = "&eth;";
		entities["203"] = "&Euml;";
		entities["235"] = "&euml;";
		entities["8364"] = "&euro;";
		entities["8707"] = "&exist;";
		entities["8704"] = "&forall;";
		entities["189"] = "&frac12;";
		entities["188"] = "&frac14;";
		entities["190"] = "&frac34;";
		entities["8260"] = "&frasl;";
		entities["915"] = "&Gamma;";
		entities["947"] = "&gamma;";
		entities["8805"] = "&ge;";
		entities["8596"] = "&harr;";
		entities["8660"] = "&hArr;";
		entities["9829"] = "&hearts;";
		entities["205"] = "&Iacute;";
		entities["237"] = "&iacute;";
		entities["206"] = "&Icirc;";
		entities["238"] = "&icirc;";
		entities["161"] = "&iexcl;";
		entities["8465"] = "&image;";
		entities["8734"] = "&infin;";
		entities["8747"] = "&int;";
		entities["191"] = "&iquest;";
		entities["8712"] = "&isin;";
		entities["922"] = "&Kappa;";
		entities["954"] = "&kappa;";
		entities["923"] = "&Lambda;";
		entities["955"] = "&lambda;";
		entities["9001"] = "&lang;";
		entities["171"] = "&laquo;";
		entities["8968"] = "&lceil;";
		entities["8804"] = "&le;";
		entities["8970"] = "&lfloor;";
		entities["8727"] = "&lowast;";
		entities["9674"] = "&loz;";
		entities["8206"] = "&lrm;";
		entities["175"] = "&macr;";
		entities["181"] = "&micro;";
		entities["183"] = "&middot;";
		entities["8722"] = "&minus;";
		entities["924"] = "&Mu;";
		entities["956"] = "&mu;";
		entities["8711"] = "&nabla;";
		entities["160"] = "&nbsp;";
		entities["8800"] = "&ne;";
		entities["8715"] = "&ni;";
		entities["172"] = "&not;";
		entities["8713"] = "&notin;";
		entities["8836"] = "&nsub;";
		entities["209"] = "&Ntilde;";
		entities["241"] = "&ntilde;";
		entities["925"] = "&Nu;";
		entities["957"] = "&nu;";
		entities["211"] = "&Oacute;";
		entities["243"] = "&oacute;";
		entities["212"] = "&Ocirc;";
		entities["244"] = "&ocirc;";
		entities["210"] = "&Ograve;";
		entities["242"] = "&ograve;";
		entities["8254"] = "&oline;";
		entities["937"] = "&Omega;";
		entities["969"] = "&omega;";
		entities["927"] = "&Omicron;";
		entities["959"] = "&omicron;";
		entities["8853"] = "&oplus;";
		entities["8744"] = "&or;";
		entities["170"] = "&ordf;";
		entities["186"] = "&ordm;";
		entities["216"] = "&Oslash;";
		entities["248"] = "&oslash;";
		entities["213"] = "&Otilde;";
		entities["245"] = "&otilde;";
		entities["8855"] = "&otimes;";
		entities["214"] = "&Ouml;";
		entities["246"] = "&ouml;";
		entities["182"] = "&para;";
		entities["8706"] = "&part;";
		entities["8869"] = "&perp;";
		entities["934"] = "&Phi;";
		entities["966"] = "&phi;";
		entities["928"] = "&Pi;";
		entities["960"] = "&pi;";
		entities["982"] = "&piv;";
		entities["177"] = "&plusmn;";
		entities["163"] = "&pound;";
		entities["8242"] = "&prime;";
		entities["8243"] = "&Prime;";
		entities["8719"] = "&prod;";
		entities["8733"] = "&prop;";
		entities["936"] = "&Psi;";
		entities["968"] = "&psi;";
		entities["8730"] = "&radic;";
		entities["9002"] = "&rang;";
		entities["187"] = "&raquo;";
		entities["8594"] = "&rarr;";
		entities["8658"] = "&rArr;";
		entities["8969"] = "&rceil;";
		entities["8476"] = "&real;";
		entities["174"] = "&reg;";
		entities["8971"] = "&rfloor;";
		entities["929"] = "&Rho;";
		entities["961"] = "&rho;";
		entities["8207"] = "&rlm;";
		entities["8901"] = "&sdot;";
		entities["167"] = "&sect;";
		entities["173"] = "&shy;";
		entities["931"] = "&Sigma;";
		entities["963"] = "&sigma;";
		entities["962"] = "&sigmaf;";
		entities["8764"] = "&sim;";
		entities["9824"] = "&spades;";
		entities["8834"] = "&sub;";
		entities["8838"] = "&sube;";
		entities["8721"] = "&sum;";
		entities["8835"] = "&sup;";
		entities["185"] = "&sup1;";
		entities["178"] = "&sup2;";
		entities["179"] = "&sup3;";
		entities["8839"] = "&supe;";
		entities["223"] = "&szlig;";
		entities["932"] = "&Tau;";
		entities["964"] = "&tau;";
		entities["8756"] = "&there4;";
		entities["920"] = "&Theta;";
		entities["952"] = "&theta;";
		entities["977"] = "&thetasym;";
		entities["8201"] = "&thinsp;";
		entities["222"] = "&THORN;";
		entities["254"] = "&thorn;";
		entities["732"] = "&tilde;";
		entities["215"] = "&times;";
		entities["218"] = "&Uacute;";
		entities["250"] = "&uacute;";
		entities["8593"] = "&uarr;";
		entities["8657"] = "&uArr;";
		entities["219"] = "&Ucirc;";
		entities["251"] = "&ucirc;";
		entities["217"] = "&Ugrave;";
		entities["249"] = "&ugrave;";
		entities["168"] = "&uml;";
		entities["978"] = "&upsih;";
		entities["933"] = "&Upsilon;";
		entities["965"] = "&upsilon;";
		entities["220"] = "&Uuml;";
		entities["252"] = "&uuml;";
		entities["8472"] = "&weierp;";
		entities["926"] = "&Xi;";
		entities["958"] = "&xi;";
		entities["221"] = "&Yacute;";
		entities["253"] = "&yacute;";
		entities["165"] = "&yen;";
		entities["255"] = "&yuml;";
		entities["918"] = "&Zeta;";
		entities["950"] = "&zeta;";
		entities["8205"] = "&zwj;";
		entities["8204"] = "&zwnj;";
	}

	if(useQuoteStyle !== "ENT_NOQUOTES") {
		entities["34"] = "&quot;";
	}
	
	if(useQuoteStyle === "ENT_QUOTES") {
		entities["39"] = "&#39;";
	}
	
	entities["60"] = "&lt;";
	entities["62"] = "&gt;";

	for (decimal in entities) {
		symbol = String.fromCharCode(decimal);
		hash_map[symbol] = entities[decimal];
	}

	return hash_map;
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
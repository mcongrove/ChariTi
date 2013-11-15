/**
 * HTTP request class
 * 
 * @class http
 */

/**
 * Standard HTTP Request
 * @param {Object} _params The arguments for the method
 * @param {Number} _params.timeout Timeout time, in milliseconds
 * @param {String} _params.type Type of request, "GET", "POST", etc
 * @param {String} _params.format Format of return data, one of "JSON", "TEXT", "XML" or "DATA"
 * @param {String} _params.url The URL source to call
 * @param {Array} _params.headers Array of request headers to send
 * @param _params.data The data to send
 * @param {Function} _params.failure A function to execute when there is an XHR error
 * @param {Function} _params.success A function to execute when when successful
 * @param {Function} _params.passthrough Parameters to pass through to the failure or success callbacks
 */
exports.request = function(_params) {
	Ti.API.debug("HTTP.request " + _params.url);

	if(Ti.Network.online) {
		var xhr = Ti.Network.createHTTPClient();

		xhr.timeout = _params.timeout ? _params.timeout : 10000;

		/**
		 * Data return
		 * @param {Object} _data The HTTP response object
		 * @ignore
		 */
		xhr.onload = function(_data) {
			if(_data) {
				switch(_params.format.toLowerCase()) {
					case "data":
					case "xml":
						_data = this.responseData;
						break;
					case "json":
						_data = JSON.parse(this.responseText);
						break;
					case "text":
						_data = this.responseText;
						break;
				}

				if(_params.success) {
					if(_params.passthrough) {
						_params.success(_data, _params.url, _params.passthrough);
					} else {
						_params.success(_data, _params.url);
					}
				} else {
					return _data;
				}
			}
		};

		if(_params.ondatastream) {
			xhr.ondatastream = function(_event) {
				if(_params.ondatastream) {
					_params.ondatastream(_event.progress);
				}
			};
		}

		/**
		 * Error handling
		 * @param {Object} _event The callback object
		 * @ignore
		 */
		xhr.onerror = function(_event) {
			if(_params.failure) {
				if(_params.passthrough) {
					_params.failure(this, _params.url, _params.passthrough);
				} else {
					_params.failure(this, _params.url);
				}
			} else {
				Ti.API.error(JSON.stringify(this));
			}

			Ti.API.error(_event);
		};

		_params.type = _params.type ? _params.type : "GET";
		_params.async = _params.async ? _params.async : true;

		xhr.open(_params.type, _params.url, _params.async);

		if(_params.headers) {
			for(var i = 0, j = _params.headers.length; i < j; i++) {
				xhr.setRequestHeader(_params.headers[i].name, _params.headers[i].value);
			}
		}

		// Overcomes the 'unsupported browser' error sometimes received
		xhr.setRequestHeader("User-Agent", "Appcelerator Titanium/" + Ti.version + " (" + Ti.Platform.osname + "/" + Ti.Platform.version + "; " + Ti.Platform.name + "; " + Ti.Locale.currentLocale + ";)");

		if(_params.data) {
			xhr.send(JSON.stringify(_params.data));
		} else {
			xhr.send();
		}
	} else {
		Ti.API.error("No internet connection");

		if(_params.failure) {
			if(_params.passthrough) {
				_params.failure(null, _params.url, _params.passthrough);
			} else {
				_params.failure(null, _params.url);
			}
		}
	}
};
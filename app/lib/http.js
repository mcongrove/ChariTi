/**
 * Standard HTTP Request
 * @param {Object} _params
 * @description The following are valid options to pass through:
 *  _params.timeout		: int Timeout request
 *  _params.type		: string GET/POST
 *  _params.format		: string json, etc.
 *  _params.data		: mixed The data to pass
 *  _params.url			: string The url source to call
 *  _params.failure		: funtion A function to execute when there is an XHR error
 *  _params.success		: function when successful
 *  _params.passthrough : Any passthrough params
 *  _params.headers     : Array of request headers
 */
exports.request = function(_params) {
	Ti.API.debug("HTTP.request " + _params.url);
	
	if(Ti.Network.online) {
		// Setup the xhr object
		var xhr = Ti.Network.createHTTPClient();

		// Set the timeout or a default if one is not provided
		xhr.timeout = _params.timeout ? _params.timeout : 10000;

		/**
		 * When XHR request is loaded
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
		 */
		xhr.onerror = function(_event) {
			if(_params.failure) {
				_params.failure(this);
			} else {
				Ti.API.error(JSON.stringify(this));
			}

			Ti.API.error(_event);
		};

		// Open the remote connection
		_params.type	= _params.type ? _params.type : "GET";
		_params.async	= _params.async ? _params.async : true;

		xhr.open(_params.type, _params.url, _params.async);

		if(_params.headers) {
			for (var i = 0, j = _params.headers.length; i < j; i++) {
				xhr.setRequestHeader(_params.headers[i].name, _params.headers[i].value);
			}
		}

		if(_params.data) {
			// send the data
			xhr.send(JSON.stringify(_params.data));
		} else {
			xhr.send();
		}
	} else {
		Ti.API.error("No internet connection");
	}
};
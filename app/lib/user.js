var APP = require("core");

exports.init = function(_callback) {
	APP.log("debug", "USER.init");

	if(Ti.App.Properties.getBool("USER_IS_SAVED")) {
		exports.login({
			username: Ti.App.Properties.getString("USER_LOGIN"),
			password: Ti.App.Properties.getString("USER_PASSWORD"),
			success: _callback
		});
	} else {
		// Auto-create users until we add user account functionality
		exports.autoCreate({
			success: _callback
		});
	}
};

exports.create = function(_params) {
	APP.log("debug", "USER.create");

	var options = {
		password: _params.password,
		password_confirmation: _params.password_confirmation
	};

	if(_params.email) {
		options.email = _params.email;
	}

	if(_params.username) {
		options.username = _params.username;
	}

	if(_params.first_name) {
		options.first_name = _params.first_name;
	}

	if(_params.last_name) {
		options.last_name = _params.last_name;
	}

	APP.ACS.Users.create(options, function(_event) {
		if(_event.success) {
			APP.log("debug", "USER.create @success");

			var user = _event.users[0];

			APP.log("trace", JSON.stringify(user));

			exports.save({
				id: user.id,
				login: (_params.username) ? _params.username : _params.email,
				password: _params.password
			});

			if(_params.success) {
				_params.success(user);
			}
		} else {
			APP.log("debug", "USER.create @error");
			APP.log("trace", JSON.stringify(_event));
		}
	});
};

exports.autoCreate = function(_params) {
	APP.log("debug", "USER.autoCreate");

	var password = Ti.Platform.id.toString(36).slice(-16);

	exports.create({
		username: Ti.Platform.id,
		password: password,
		password_confirmation: password,
		success: function(_data) {
			APP.log("debug", "USER.autoCreate @success");
			APP.log("trace", JSON.stringify(_data));

			Ti.App.Properties.setBool("USER_AUTO_GENERATED", true)

			if(_params.success) {
				_params.success();
			}
		}
	});
};

exports.save = function(_params) {
	APP.log("debug", "USER.save");

	Ti.App.Properties.setString("USER_ID", _params.id);
	Ti.App.Properties.setString("USER_LOGIN", _params.login);
	Ti.App.Properties.setString("USER_PASSWORD", _params.password);

	Ti.App.Properties.setBool("USER_IS_SAVED", true);
	Ti.App.Properties.setBool("USER_LOGGED_IN", true);
};

exports.login = function(_params) {
	APP.log("debug", "USER.login");

	APP.ACS.Users.login({
		login: _params.username,
		password: _params.password
	}, function(_event) {
		if(_event.success) {
			APP.log("debug", "USER.login @success");

			var user = _event.users[0];

			APP.log("trace", JSON.stringify(user));

			exports.save({
				id: user.id,
				login: (_params.username) ? _params.username : _params.email,
				password: _params.password
			});

			if(_params.success) {
				_params.success();
			}
		} else {
			APP.log("debug", "USER.login @error");
			APP.log("trace", JSON.stringify(_event));
		}
	});
};

exports.logout = function() {
	APP.log("debug", "USER.logout");
};
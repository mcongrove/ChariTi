var APP = require("core");

exports.previous;
exports.current;

/**
 * Checks versions, need for migration
 */
exports.init = function() {
	Ti.API.debug("MIGRATE.init");

	var regexp = /(\d+\.?)*\./g;

	var current = APP.CVERSION.match(regexp)[0];
	current = current.substr(0, current.length - 1);

	exports.current = current;

	var db = Ti.Database.open("ChariTi");
	var result = db.execute("SELECT name FROM sqlite_master WHERE name = 'log';");
	var previousInstall = result.rowCount == 1 ? true : false;

	result.close();
	db.close();

	if(previousInstall) {
		var previous = Ti.App.Properties.getString("CVERSION", "1.0.0");

		exports.previous = previous;

		exports.migrate();
	}

	Ti.App.Properties.setString("CVERSION", current);
};

/**
 * Performs the migration steps
 */
exports.migrate = function() {
	Ti.API.debug("MIGRATE.migrate " + exports.previous + " => " + exports.current);

	var db = Ti.Database.open("ChariTi");
	db.remove();
};
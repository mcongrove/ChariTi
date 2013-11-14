/**
 * Version migration class
 * 
 * @class migrate
 * @uses core
 */

var APP = require("core");

/**
 * Checks versions, determines need for migration
 * @ignore
 */
exports.init = function() {
	Ti.API.debug("MIGRATE.init");

	var regexp = /(\d+\.?)*\./g;

	var current = APP.CVERSION.match(regexp)[0];
	current = current.substr(0, current.length - 1);

	var db = Ti.Database.open("ChariTi");
	var result = db.execute("SELECT name FROM sqlite_master WHERE name = 'log';");
	var previousInstall = result.rowCount == 1 ? true : false;

	result.close();
	db.close();

	if(previousInstall) {
		var previous = Ti.App.Properties.getString("CVERSION", "1.0.0");

		if(current !== previous) {
			APP.dropDatabase();

			Ti.App.Properties.setBool("OUTDATED", false);

			Ti.API.info("Migrating " + previous + " => " + current);
		}
	}

	Ti.App.Properties.setString("CVERSION", current);
};
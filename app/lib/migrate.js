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

	var current = parseInt(APP.CVERSION.replace(".", ""), 10);
	var previous = parseInt(Ti.App.Properties.getString("CVERSION", APP.CVERSION).replace(".", ""), 10);

	if(current > previous) {
		APP.dropDatabase();

		Ti.App.Properties.setBool("OUTDATED", false);

		Ti.API.info("Migrating " + previous + " => " + current);
	}

	Ti.App.Properties.setString("CVERSION", current);
};
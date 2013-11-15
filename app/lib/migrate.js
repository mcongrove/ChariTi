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
	var previous = Ti.App.Properties.getString("CVERSION", APP.CVERSION);

	if(current !== previous) {
		APP.dropDatabase();

		Ti.App.Properties.setBool("OUTDATED", false);

		Ti.API.info("Migrating " + previous + " => " + current);
	}

	Ti.App.Properties.setString("CVERSION", current);
};
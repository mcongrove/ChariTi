exports.previous;
exports.current;

/**
 * Checks versions, need for migration
 */
exports.init = function(_current) {
	var regexp = /(\d+\.?)*\./g;

	var current = _current.match(regexp)[0];
	current = current.substr(0, current.length - 1);

	exports.current = current;

	var db = Ti.Database.open("ChariTi");
	var result = db.execute("SELECT name FROM sqlite_master WHERE name = 'log';");
	var previousInstall = result.rowCount == 1 ? true : false;

	result.close();
	db.close();

	if(previousInstall) {
		var previous = Ti.App.Properties.getString("CVERSION", "1.0.0.A").match(regexp)[0];
		previous = previous.substr(0, previous.length - 1);

		exports.previous = previous;

		exports.migrate();
	}

	Ti.App.Properties.setString("CVERSION", current);
};

/**
 * Performs the migration steps
 */
exports.migrate = function() {
	switch(exports.current) {
		case "1.0.0":
			return;
			break;
		case "1.0.1":
			switch(exports.previous) {
				case "1.0.0":
					exports.addColumn("news", "image", "TEXT");
					exports.addColumn("blog", "image", "TEXT");
					break;
			}
			break;
		case "1.1.0":
			switch(exports.previous) {
				case "1.0.0":
					exports.addColumn("news", "image", "TEXT");
					exports.addColumn("blog", "image", "TEXT");
					break;
				case "1.0.1":
					break;
			}
			break;
	}
};

/**
 * Adds a column to a table if it doesn't exist (for migrating tables)
 */
exports.addColumn = function(_table, _column, _type) {
	var db = Ti.Database.open("ChariTi");

	var fieldExists = false;
	var result = db.execute("PRAGMA TABLE_INFO(" + _table + ")");

	while(result.isValidRow()) {
		if(result.field(1) == _column) {
			fieldExists = true;
		}

		result.next();
	}

	result.close();

	if(!fieldExists) {
		db.execute("ALTER TABLE " + _table + " ADD COLUMN " + _column + " " + _type);
	}

	db.close();
};
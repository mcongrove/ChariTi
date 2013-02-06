var APP = require("core");

$.appInit = null;

$.init = function() {
	APP.log("debug", "peek.init");

	APP.Configuration = $.Wrapper;

	$.overrideCore();
	$.openConfiguration();
	$.loadHistory();
};

$.overrideCore = function() {
	$.appInit = APP.init;

	APP.init = function() {};
	APP.rebuildRestart = function() {};
	APP.update = function() {};
	APP.registerForPush = function() {};
};

$.openConfiguration = function() {
	APP.MainWindow.add(APP.Configuration);

	APP.GlobalWrapper.visible = false;
	APP.Configuration.visible = true;

	APP.MainWindow.open();
};

$.loadHistory = function() {
	var urls = Ti.App.Properties.getList("URLS", []);
	var rows = [];

	for(var i = 0, z = URLS.length; i < z; i++) {
		var row = Ti.UI.createTableViewRow({
			title: urls[i],
			height: Ti.UI.SIZE,
			selectedBackgroundColor: "#222",
			font: {
				fontSize: "16dp",
				fontWeight: "bold"
			},
			color: "#666",
			hasChild: true
		});

		rows.push(row);
	}

	$.history.setData(rows);
};

$.loadApp = function(_url) {
	// Restore the APP.init function
	APP.init = $.appInit;

	// Update the configuration file
	require("update").init({
		url: _url,
		callback: function() {
			// Remove configuration screen
			APP.GlobalWrapper.visible = true;
			APP.Configuration.visible = false;

			// Rebuild
			APP.rebuild();

			// Start the APP
			APP.init();
		}
	});
};

$.configureSettings = function(_view) {
	var children = _view.getChildren();

	for(var i = 0, x = children.length; i < x; i++) {
		_view.remove(children[i]);
	}

	var newChildren = Alloy.createController("peek_settings").getView();

	_view.add(newChildren);

	for(var i = 0, x = children.length; i < x; i++) {
		_view.add(children[i]);
	}
};

// Event listeners
$.urlField.addEventListener("return", function(_event) {
	var url = $.urlField.value;

	if(url.length > 0) {
		Ti.App.Properties.setString("URL", url);

		$.loadApp(url);

		// Save the history
		var urls = Ti.App.Properties.getList("URLS", []);
		urls.push(url);
		Ti.App.Properties.setList("URLS", urls);
	}
});

$.history.addEventListener("click", function(_event) {
	var url = _event.row.title;

	if(url.length > 0) {
		Ti.App.Properties.setString("URL", url);

		$.loadApp(url);
	}
});

// Kick off the init
$.init();
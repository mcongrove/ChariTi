var APP = require("core");

$.appInit = null;

$.init = function() {
	APP.Configuration = $.Wrapper;

	APP.setupDatabase();

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
	var urls = Ti.App.Properties.getList("URLS", [
		"http://chariti.mobi/app/app.json"
	]);

	var rows = [];

	for(var i = urls.length, z = 0; i > z; i--) {
		var row = Ti.UI.createTableViewRow({
			title: urls[i - 1],
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
	// Save the URL for later usage
	Ti.App.Properties.setString("URL", _url);

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

$.deleteRow = function(_url) {
	var urls = Ti.App.Properties.getList("URLS", []);
	var newUrls = [];

	for(var i = 0, z = urls.length; i < z; i++) {
		if(urls[i] !== _url) {
			newUrls.push(urls[i]);
		}
	}

	Ti.App.Properties.setList("URLS", newUrls);
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
		$.loadApp(url);
	}
});

if(OS_IOS) {
	$.history.addEventListener("delete", function(_event) {
		$.deleteRow(_event.row.title);
	});
} else {
	$.history.addEventListener("longpress", function(_event) {
		var url = _event.row.title;
		var index = _event.index;
	
		var dialog = Ti.UI.createOptionDialog({
			options: ["Preview", "Delete", "Cancel"],
			cancel: 2,
			selectedIndex: 0
		});
	
		dialog.addEventListener("click", function(_event) {
			switch(_event.index) {
				case 0:
					$.loadApp(url);
					break;
				case 1:
					$.deleteRow(url);
					$.history.deleteRow(index);
					break;
			}
		});
	
		dialog.show();
	});
}

// Kick off the init
$.init();
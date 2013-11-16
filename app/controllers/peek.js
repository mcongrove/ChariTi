var APP = require("core");
var UTIL = require("utilities");

$.appInit = null;

$.init = function() {
	APP.Configuration = $.Wrapper;

	APP.determineDevice();
	APP.setupDatabase();

	$.overrideCore();
	$.openConfiguration();
	$.loadHistory();
	$.handleLaunchUrl();
};

$.overrideCore = function() {
	$.appInit = APP.init;

	APP.init = function() {};
	APP.initACS = function() {};
	APP.initPush = function() {};
	APP.update = function() {};
	APP.rebuildRestart = function() {};
};

$.openConfiguration = function() {
	APP.MainWindow.add(APP.Configuration);
	APP.MainWindow.remove(APP.GlobalWrapper);

	APP.MainWindow.open();
};

$.handleLaunchUrl = function() {
	var arguments = Ti.App.getArguments();

	if(typeof arguments == "object" && arguments.hasOwnProperty("url")) {
		if(arguments.url !== Ti.App.Properties.getString("LaunchURL")) {
			Ti.App.Properties.setString("LaunchURL", arguments.url);

			var url = UTIL.parseUrl("url", arguments.url);

			if(!url) {
				return;
			}

			$.loadApp(url);
		}
	}
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
	// Normalize the URL
	if(_url.indexOf("://") < 0) {
		_url = "http://" + _url;
	}

	// Save the URL for later usage
	Ti.App.Properties.setString("URL", _url);

	// Restore the APP.init function
	APP.init = $.appInit;

	// Update the configuration file
	require("update").init({
		url: _url,
		callback: function() {
			// Remove configuration screen
			APP.MainWindow.add(APP.GlobalWrapper);
			APP.MainWindow.remove(APP.Configuration);

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
		// Load up the app
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

// Move the UI down if iOS7+
if(OS_IOS && APP.Device.versionMajor >= 7) {
	$.logo.top = "40dp";
}
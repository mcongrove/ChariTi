var APP = require("core");

$.init = function() {
	APP.log("debug", "settings.init");

	if(!APP.LEGAL.TOS && !APP.LEGAL.PRIVACY) {
		$.content.remove($.legal_table);
	} else if(!APP.LEGAL.TOS || !APP.LEGAL.PRIVACY) {
		if(!APP.LEGAL.TOS) {
			$.legal_table.deleteRow(0);
		}

		if(!APP.LEGAL.PRIVACY) {
			$.legal_table.deleteRow(1);
		}

		$.legal_table.height = "45dp";
	}

	if(!Ti.UI.createEmailDialog().isSupported) {
		$.content.remove($.logs_table);
	}

	$.copyright.text = APP.LEGAL.COPYRIGHT;
	$.version.text = "Version " + APP.VERSION + ", ChariTi " + APP.CVERSION;

	$.NavigationBar.setBackgroundColor(APP.Settings.colors.primary || "#000");

	if(APP.Settings.useSlideMenu) {
		$.NavigationBar.showMenu();
	} else {
		$.NavigationBar.showBack({
			callback: function(_event) {
				APP.removeChild(true);
			}
		});
	}
};

// Event listeners
$.terms.addEventListener("click", function(_event) {
	APP.log("debug", "settings @terms");

	APP.addChild("settings_legal", {
		title: "Terms of Service",
		url: APP.LEGAL.TOS
	}, true);
});

$.privacy.addEventListener("click", function(_event) {
	APP.log("debug", "settings @privacy");

	APP.addChild("settings_legal", {
		title: "Privacy Policy",
		url: APP.LEGAL.PRIVACY
	}, true);
});

$.acknowledgements.addEventListener("click", function(_event) {
	APP.log("debug", "settings @credits");

	APP.addChild("settings_credits", {}, true);
});

$.logs.addEventListener("click", function(_event) {
	APP.log("debug", "settings @logs");

	APP.logSend();
});

// Kick off the init
$.init();
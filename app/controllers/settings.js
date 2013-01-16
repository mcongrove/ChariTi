var APP = require("core");

$.init = function() {
	APP.log("debug", "settings.init");
	
	$.NavigationBar.Wrapper.backgroundColor	= APP.Settings.colors.primary || "#000";
	$.NavigationBar.back.visible			= true;
	
	if(!APP.LEGAL.TOS && !APP.LEGAL.PRIVACY) {
		$.content.remove($.legal_table);
	} else if(!APP.LEGAL.TOS || !APP.LEGAL.PRIVACY) {
		if(!APP.LEGAL.TOS) {
			$.legal_table.deleteRow($.terms);
		}
	
		if(!APP.LEGAL.PRIVACY) {
			$.legal_table.deleteRow($.privacy);
		}
		
		$.legal_table.height	= "45dp";
	}
	
	$.copyright.text = APP.LEGAL.COPYRIGHT;
	$.version.text = "Version " + APP.VERSION + ", ChariTi " + APP.CVERSION;
};

// Event listeners
$.NavigationBar.back.addEventListener("click", function(_event) {
	APP.log("debug", "settings @close");
	
	APP.closeDetailScreen(null, 'settings');
});

$.terms.addEventListener("click", function(_event) {
	APP.log("debug", "settings @terms");
	
	APP.openDetailScreen("settings_legal", {
		title: "Terms of Service",
		url: APP.LEGAL.TOS
	}, 'settings');
});

$.privacy.addEventListener("click", function(_event) {
	APP.log("debug", "settings @privacy");
	
	APP.openDetailScreen("settings_legal", {
		title: "Privacy Policy",
		url: APP.LEGAL.PRIVACY
	}, 'settings');
});

$.acknowledgements.addEventListener("click", function(_event) {
	APP.log("debug", "settings @credits");
	
	APP.openDetailScreen("settings_credits", {}, 'settings');
});

$.logs.addEventListener("click", function(_event) {
	APP.log("debug", "settings @logs");
	
	APP.logSend();
});

// Kick off the init
$.init();
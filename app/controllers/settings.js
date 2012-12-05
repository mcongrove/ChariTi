var APP = require("core");

$.init = function() {
	APP.log("debug", "settings.init");
	
	$.NavigationBar.Wrapper.backgroundColor	= APP.Settings.colors.primary || "#000";
	$.NavigationBar.back.visible			= true;
	
	$.version.text = "Version " + APP.VERSION + ", ChariTi " + APP.CVERSION;
	$.copyright.text = APP.LEGAL.COPYRIGHT;
};

// Event listeners
$.NavigationBar.back.addEventListener("click", function(_event) {
	APP.log("debug", "settings @close");
	
	APP.closeDetailScreen();
});

$.terms.addEventListener("click", function(_event) {
	APP.log("debug", "settings @terms");
	
	APP.openDetailScreen("settings_legal", {
		title: "Terms of Service",
		url: APP.LEGAL.TOS
	});
});

$.privacy.addEventListener("click", function(_event) {
	APP.log("debug", "settings @privacy");
	
	APP.openDetailScreen("settings_legal", {
		title: "Privacy Policy",
		url: APP.LEGAL.PRIVACY
	});
});

$.acknowledgements.addEventListener("click", function(_event) {
	APP.log("debug", "settings @credits");
	
	APP.openDetailScreen("settings_credits");
});

$.logs.addEventListener("click", function(_event) {
	APP.log("debug", "settings @logs");
});

// Kick off the init
$.init();
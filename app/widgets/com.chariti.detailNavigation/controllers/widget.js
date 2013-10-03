var APP = require("core");
var CONFIG = arguments[0] || {};

if(CONFIG.up && typeof CONFIG.up == "function") {
	$.arrowUp.addEventListener("click", CONFIG.up);
} else {
	$.arrowUp.opacity = 0.4;
}

if(CONFIG.down && typeof CONFIG.down == "function") {
	$.arrowDown.addEventListener("click", CONFIG.down);
} else {
	$.arrowDown.opacity = 0.4;
}

// Move the UI down if iOS7+
if(OS_IOS && APP.Device.versionMajor >= 7) {
	$.Wrapper.top = "37dp";
}
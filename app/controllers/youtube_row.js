/**
 * Controller for the YouTube table row
 * 
 * @class Controllers.youtube.row
 * @uses core
 */
var APP = require("core");

var CONFIG = arguments[0] || {};

$.Wrapper.id = CONFIG.id || 0;
$.Wrapper.url = CONFIG.url || "";
$.Wrapper.setTitle = CONFIG.heading || "";
$.heading.text = CONFIG.heading || "";
$.subHeading.text = CONFIG.subHeading || "";
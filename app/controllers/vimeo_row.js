/**
 * Controller for the Vimeo table row
 * 
 * @class Controllers.vimeo.row
 * @uses core
 */
var APP = require("core");

var CONFIG = arguments[0] || {};

$.Wrapper.id = CONFIG.id || 0;
$.Wrapper.url = CONFIG.url || "";
$.heading.text = CONFIG.heading || "";
$.subHeading.text = CONFIG.subHeading || "";
/**
 * Controller for the share table row
 * 
 * @class Controllers.share.row
 * @uses core
 */
var APP = require("core");

var CONFIG = arguments[0] || {};

$.Wrapper.id = CONFIG.id || 0;
$.heading.text = CONFIG.heading || "";
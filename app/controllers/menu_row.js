/**
 * Controller for the menu table row
 * 
 * @class Controllers.menu.row
 * @uses core
 */
var APP = require("core");

var CONFIG = arguments[0] || {};

$.Wrapper.id = CONFIG.id || 0;
$.title.text = CONFIG.title || "";
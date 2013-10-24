/**
 * Controller for the article table row
 * 
 * @class Controllers.article.row
 * @uses core
 */
var APP = require("core");

var CONFIG = arguments[0] || {};

$.Wrapper.id = CONFIG.id || 0;
$.heading.text = CONFIG.heading || "";
$.subHeading.text = CONFIG.subHeading || "";
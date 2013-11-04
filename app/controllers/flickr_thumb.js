/**
 * Controller for the Flickr thumbnail photo
 * 
 * @class Controllers.flickr.thumb
 * @uses core
 */
var CONFIG = arguments[0] || {};

$.Image.id = CONFIG.id || 0;
$.Image.image = CONFIG.image || "";
$.Image.left = CONFIG.left || "0dp";
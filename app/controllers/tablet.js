/**
 * Controller for the tablet form-factor view
 * 
 * **NOTE: Every controller that supports a master-child (tablet)
 * split view will use this controller for layout.**
 * 
 * @class Controllers.tablet
 * @uses core
 */
var APP = require("core");

var CONFIG = arguments[0];

APP.Master[APP.currentStack] = $.Master;
APP.Detail[APP.currentStack] = $.Detail;

APP.addChild("tablet_detail");
APP.addMasterScreen(CONFIG.type.toLowerCase(), CONFIG, $.Wrapper);
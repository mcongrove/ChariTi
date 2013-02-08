var APP = require("core");

var CONFIG = arguments[0];

APP.Master[APP.currentStack] = $.Master;
APP.Detail[APP.currentStack] = $.Detail;

APP.addChild("tablet_detail");
APP.addMasterScreen(CONFIG.controller, CONFIG, $.Wrapper);
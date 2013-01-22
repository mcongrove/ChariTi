var APP = require("core");

APP.Master[APP.currentStack] = $.Master;
APP.Detail[APP.currentStack] = $.Detail;

APP.addChild("tablet_detail");

var master	= Alloy.createController("youtube", arguments[0]).getView();
APP.addMasterScreen(master);
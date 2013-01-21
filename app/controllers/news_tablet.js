var APP		= require("core");

APP.Master[APP.currentStack] = $.Master;
APP.Detail[APP.currentStack] = $.Detail;

var detail	= Alloy.createController("tablet_detail").getView();
APP.addDetailScreen(detail);

var master	= Alloy.createController("news", arguments[0]).getView();
APP.addMasterScreen(master);
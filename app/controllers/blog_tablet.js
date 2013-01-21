var APP		= require("core");

var master = Alloy.createController("blog", arguments[0]).getView();
var detail = Alloy.createController("blog_article").getView();

APP.addMasterScreen(master, $.Master);
APP.addDetailScreen(detail, $.Detail);
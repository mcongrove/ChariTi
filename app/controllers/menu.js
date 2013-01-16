var APP = require("core");
var UTIL = require("utilities");

var CONFIG = arguments[0];

$.init = function() {
    APP.log("debug", "news.init | " + JSON.stringify(CONFIG));
    
    APP.openLoading();
    
    $.NavigationBar.Wrapper.backgroundColor = APP.Settings.colors.primary || "#000";
    $.NavigationBar.right.visible           = true;
    $.NavigationBar.rightImage.image        = "/images/settings.png";

    if (CONFIG.isChild === true) {
        $.NavigationBar.back.visible        = true;
    }

    $.handleData(CONFIG.items);
};

$.handleData = function(_data) {
    APP.log("debug", "news.handleData");
    
    var rows = [];
    
    for(var i = 0, x = _data.length; i < x; i++) {
        var row = Alloy.createController("menu_row", {
            title: _data[i].title
            // icon: "/icons/" + _data[i].image + ".png"
        }).getView();

        _data[i].isChild = true;

        row.rowData = _data[i];
        rows.push(row);
    }
    
    $.content.setData(rows);
    
    APP.closeLoading();
};

// Event listeners
$.NavigationBar.back.addEventListener("click", function(_event) {
    APP.log("debug", "menu @close");
    
    APP.closeDetailScreen();
});

$.NavigationBar.right.addEventListener("click", function(_event) {
    APP.openSettings();
});

$.content.addEventListener("click", function(_event) {
    // APP.log("debug", "news @click " + _event.row.id);
    
    APP.openDetailScreen(_event.row.rowData.type, _event.row.rowData);
});

// Kick off the init
$.init();
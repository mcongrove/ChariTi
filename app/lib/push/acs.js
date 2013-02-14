var APP = require("core");
var PUSH = require("push");

PUSH.subscribe = function(deviceToken, channel) {
    APP.log("debug", "PUSH.subscribe");

    if(!deviceToken || !channel) {
        APP.log("error", "PUSH.subscribe - deviceToken and channel are required arguments.");
    }

    APP.Cloud.PushNotifications.subscribe({
        channel: channel,
        device_token: deviceToken
    }, function(e) {
        if(e.success) {
            APP.log("debug", "PUSH.subscribe.Success");
        } else {
            APP.log("error", "PUSH.subscribe - " + JSON.stringify(e));
        }
    });

};

exports.init = function() {
    if (OS_IOS) {
        APP.log("debug", "PUSH.initACS.OS_IOS");

        // We have to login into ACS first.
        require("user").init(function() {
            Ti.Network.registerForPushNotifications({
                types:[
                    Ti.Network.NOTIFICATION_TYPE_BADGE,
                    Ti.Network.NOTIFICATION_TYPE_ALERT,
                    Ti.Network.NOTIFICATION_TYPE_SOUND
                ],
                success: function(e) {    
                    console.log(JSON.stringify(e));
                    var deviceToken = e.deviceToken;

                    APP.log("debug", "PUSH.initACS @success");
                    APP.log("trace", deviceToken);   
                    PUSH.deviceToken = deviceToken;
                    PUSH.subscribe(deviceToken, 'all');                    
                    
                },
                error: function(e) {
                    APP.log("debug", "PUSH.initACS @error");
                    APP.log("trace", JSON.stringify(e));
                },
                callback: function(e) {
                    PUSH.pushRecieved(e.data);                
                }
            }); 
        });    
    }   

    if (OS_ANDROID) {

    }
};
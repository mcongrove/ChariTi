/*
 * Demonstrates how to set up your UA Airmail Mailbox,
 * and how to receive notifications from UA
 */

// open a single window
var window = Ti.UI.createWindow({backgroundColor: 'white', layout: 'vertical'});

var btnOpen = Ti.UI.createButton({
    title: 'Open UA Inbox',
    width: 200, height: 40
});
btnOpen.addEventListener('click', function() {
    // Open default mailbox
    UrbanAirship.displayInbox({ animated:true });
});
window.add(btnOpen);

window.add(Ti.UI.createLabel({
    text: 'DeviceID:',
    top: 10,
    left: 10,
    textAlign: 'left',
    color: 'black',
    font: {fontSize: 18, fontStyle: 'bold'},
    height: Ti.UI.SIZE || 'auto'
}));

var labelID = Ti.UI.createLabel({
    text: '',
    top: 10,
    left: 10,
    right: 10,
    textAlign: 'left',
    color: 'black',
    height: Ti.UI.SIZE || 'auto'
});
window.add(labelID);

window.add(Ti.UI.createLabel({
    text: 'Last Message:',
    top: 10,
    left: 10,
    textAlign: 'left',
    color: 'black',
    font: {fontSize: 18, fontStyle: 'bold'},
    height: Ti.UI.SIZE || 'auto'
}));

var labelMessage = Ti.UI.createLabel({
    text: '',
    top: 10,
    left: 10,
    right: 10,
    textAlign: 'left',
    color: 'black',
    height: Ti.UI.SIZE || 'auto'
});
window.add(labelMessage);

window.add(Ti.UI.createLabel({
    text: 'Payload:',
    top: 10,
    left: 10,
    textAlign: 'left',
    color: 'black',
    font: {fontSize: 18, fontStyle: 'bold'},
    height: Ti.UI.SIZE || 'auto'
}));

var labelPayload = Ti.UI.createLabel({
    text: ' ',
    top: 10,
    left: 10,
    right: 10,
    textAlign: 'left',
    color: 'black',
    height: Ti.UI.SIZE || 'auto'
});
window.add(labelPayload);

window.open();

var UrbanAirship = require('ti.urbanairship');
Ti.API.info("module is => " + UrbanAirship);

/*
 * Urban Airship will load the options from an AirshipConfig.plist file that
 * should be stored in the application bundle. You will find an example
 * AirshipConfig.plist file in the 'example/platform/iphone' folder of the module.
 * Alternatively, you can set the 'options' property of the module object.
 
UrbanAirship.options = {
    APP_STORE_OR_AD_HOC_BUILD: false,
    PRODUCTION_APP_KEY: '=== YOUR PROD APP KEY ===',
    PRODUCTION_APP_SECRET: '=== YOUR PROD APP SECRET ===',
    DEVELOPMENT_APP_KEY: '=== YOUR DEV APP KEY ===',
    DEVELOPMENT_APP_SECRET: '=== YOUR DEV APP SECRET ===',
    LOGGING_ENABLED: true
};

*/

// Set UA options
UrbanAirship.tags = [ 'testingtesting', 'appcelerator', 'my-tags' ];
UrbanAirship.alias = 'testDevice';
UrbanAirship.autoBadge = true;
UrbanAirship.autoResetBadge = true;

function eventCallback(e) {
	// Pass the notification to the module
    UrbanAirship.handleNotification(e.data);
    	
  	Ti.API.info('Push message received');
  	Ti.API.info('  Message: ' + e.data.alert);
  	Ti.API.info('  Payload: ' + e.data.aps);
    
    labelMessage.text = e.data.alert;
	labelPayload.text = JSON.stringify(e.data.aps);	
}

function eventSuccess(e) {
	// *MUST* pass the received token to the module
    UrbanAirship.registerDevice(e.deviceToken);  
    
    Ti.API.info('Received device token: ' + e.deviceToken);
    labelID.text = e.deviceToken;
    btnOpen.enabled = true;		
}

function eventError(e) {
    Ti.API.info('Error:' + e.error);
    var alert = Ti.UI.createAlertDialog({
        title: 'Error',
        message: e.error
    });
    alert.show();	
}

Ti.Network.registerForPushNotifications({
    types:[
        Ti.Network.NOTIFICATION_TYPE_BADGE,
        Ti.Network.NOTIFICATION_TYPE_ALERT,
        Ti.Network.NOTIFICATION_TYPE_SOUND
    ],
    success: eventSuccess,
    error: eventError,
    callback: eventCallback
});


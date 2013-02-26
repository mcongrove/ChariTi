/*
 * Test for ti.urbanairship module: Demonstrates how to set up push notifications
 * using the Urban Airship push notification library.
 */

/// open a single window
var window = Ti.UI.createWindow({backgroundColor:'white', layout:'vertical'});

var pushOnSwitch = Ti.UI.createSwitch({
	value:false,
	isSwitch:true,
	top:10,
	left:10,
	height:Ti.UI.SIZE || 'auto',
	width:200,
	titleOn:'Disable Push',
	titleOff:'Enable Push'
});
window.add(pushOnSwitch);

window.add(Ti.UI.createLabel({
	text:'APID:',
	top:10,
	left:10,
	textAlign:'left',
	color:'black',
	font:{fontSize:18, fontStyle:'bold'},
	height:Ti.UI.SIZE || 'auto'
}));

var labelAPID = Ti.UI.createLabel({
	text:'',
	top:10,
	left:10,
	textAlign:'left',
	color:'black',
	height:Ti.UI.SIZE || 'auto'
});
window.add(labelAPID);

window.add(Ti.UI.createLabel({
	text:'Last Message:',
	top:10,
	left:10,
	textAlign:'left',
	color:'black',
	font:{fontSize:18, fontStyle:'bold'},
	height:Ti.UI.SIZE || 'auto'
}));

var labelMessage = Ti.UI.createLabel({
	text:'',
	top:10,
	left:10,
	textAlign:'left',
	color:'black',
	height:Ti.UI.SIZE || 'auto'
});
window.add(labelMessage);

window.add(Ti.UI.createLabel({
	text:'Payload:',
	top:10,
	left:10,
	textAlign:'left',
	color:'black',
	font:{fontSize:18, fontStyle:'bold'},
	height:Ti.UI.SIZE || 'auto'
}));

var labelPayload = Ti.UI.createLabel({
	text:'',
	top:10,
	left:10,
	textAlign:'left',
	color:'black',
	height:Ti.UI.SIZE || 'auto'
});
window.add(labelPayload);

window.open();

var UrbanAirship = require('ti.urbanairship');
Ti.API.info("module is => " + UrbanAirship);

// Set UA options
UrbanAirship.showOnAppClick = true;
UrbanAirship.tags = [ 'testingtesting', 'appcelerator', 'my-tags' ];
UrbanAirship.alias = 'testDevice';

// Display current pushId (use ua.c2dmId if using C2DM)
labelAPID.text = UrbanAirship.pushId;

// Set switch to current state of push
pushOnSwitch.value = UrbanAirship.pushEnabled;

// Toggle push state on switch change
pushOnSwitch.addEventListener('change', function (e) {
	UrbanAirship.pushEnabled = e.value;
});

function eventCallback(e) {
	if (e.clicked) {
		Ti.API.info('User clicked a notification');
	} else {
		Ti.API.info('Push message received');
	}
	Ti.API.info('  Message: ' + e.message);
	Ti.API.info('  Payload: ' + e.payload);

	labelMessage.text = e.message;
	labelPayload.text = e.payload;
}

function eventSuccess(e) {
	Ti.API.info('Received device token: ' + e.deviceToken);
	labelAPID.text = e.deviceToken;
}

function eventError(e) {
	Ti.API.info('Error:' + e.error);
	var alert = Ti.UI.createAlertDialog({
		title:'Error',
		message:e.error
	});
	alert.show();
}

UrbanAirship.addEventListener(UrbanAirship.EVENT_URBAN_AIRSHIP_CALLBACK, eventCallback);
UrbanAirship.addEventListener(UrbanAirship.EVENT_URBAN_AIRSHIP_SUCCESS, eventSuccess);
UrbanAirship.addEventListener(UrbanAirship.EVENT_URBAN_AIRSHIP_ERROR, eventError);



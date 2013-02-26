windowFunctions['Login Status'] = function () {
	var win = createWindow();
	var offset = addBackButton(win);
	var content = Ti.UI.createScrollView({
		top: offset + u,
		contentHeight: 'auto',
		layout: 'vertical'
	});
	win.add(content);

	content.add(Ti.UI.createLabel({
			text: 'accessToken: ' + Cloud.accessToken, textAlign: 'left',
			height: 40 + u, left: 20 + u, right: 20 + u
	}));
	content.add(Ti.UI.createLabel({
			text: 'expiresIn: ' + Cloud.expiresIn, textAlign: 'left',
			height: 40 + u, left: 20 + u, right: 20 + u
	}));
	content.add(Ti.UI.createLabel({
			text: 'sessionId: ' + Cloud.sessionId, textAlign: 'left',
			height: 40 + u, left: 20 + u, right: 20 + u
	}));

	win.open();
};
windowFunctions['Create Message'] = function (evt) {
    var win = createWindow();
    var offset = addBackButton(win);
    var content = Ti.UI.createScrollView({
        top: offset + u,
        contentHeight: 'auto',
        layout: 'vertical'
    });
    win.add(content);

	var toView = Ti.UI.createView({
		top: 10 + u, left: 10 + u, right: 10 + u,
		height: Ti.UI.SIZE || 'auto',
		layout: 'horizontal'
	});
	var toSet = {
		ids: [],
		names: []
	};
    var toButton = Ti.UI.createButton({
        title: 'To:', 
        height: 40 + u,
        width: Ti.UI.SIZE || 'auto'
    });
    toButton.addEventListener('click', function (e) {
	    handleOpenWindow({ target: 'Select Users for Message', toSet: toSet });
    });
    toView.add(toButton);

	var toNames = Ti.UI.createTextField({
		left: 10 + u, right: 0,
		height: 40 + u,
		borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		editable: false,
		ellipsize: true
	});
	toView.add(toNames);
	content.add(toView);

	var subject = Ti.UI.createTextField({
		hintText: 'Subject',
		top: 10 + u, left: 10 + u, right: 10 + u,
		height: 40 + u,
		borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		autocorrect: false
	});
	content.add(subject);

	var body = Ti.UI.createTextArea({
		hintText: 'Body',
		top: 10 + u, left: 10 + u, right: 10 + u,
		height: 120 + u,
      	borderWidth: 2,
      	borderColor: '#bbb',
      	borderRadius: 5,
      	font: {fontSize:20 }
	});
	content.add(body);

    var createButton = Ti.UI.createButton({
        title: 'Create',
        top: 10 + u, left: 10 + u, right: 10 + u, bottom: 10 + u,
        height: 40 + u
    });
    createButton.addEventListener('click', function (evt) {
    	createButton.hide();
        Cloud.Messages.create({
	        to_ids: toSet.ids.join(','),
	        body: body.value,
	        subject: subject.value
        }, function (e) {
            if (e.success) {
                alert('Created!');
	            body.value = subject.value = toNames.value = '';
	            toSet.ids = [];
	            toSet.names = [];
            } else {
                error(e);
            }
            createButton.show();
        });
    });
    content.add(createButton);

    win.addEventListener('open', function () {
        subject.focus();
    });
	win.addEventListener('focus', function () {
        toNames.value = toSet.names.join(',');
    });
    win.open();
};
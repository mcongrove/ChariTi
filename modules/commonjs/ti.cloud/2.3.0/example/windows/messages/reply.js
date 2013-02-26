windowFunctions['Reply Message'] = function (evt) {
    var win = createWindow();
    var offset = addBackButton(win);
    var content = Ti.UI.createScrollView({
        top: offset + u,
        contentHeight: 'auto',
        layout: 'vertical'
    });
    win.add(content);

	var subject = Ti.UI.createTextField({
		top: 10 + u, left: 10 + u, right: 10 + u,
		height: 40 + u,
		borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		editable: false,
		ellipsize: true,
		value: evt.subject || ""
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

    var replyButton = Ti.UI.createButton({
        title: 'Reply',
        top: 10 + u, left: 10 + u, right: 10 + u, bottom: 10 + u,
        height: 40 + u
    });
    replyButton.addEventListener('click', function () {
    	replyButton.hide();
        Cloud.Messages.reply({
	        message_id: evt.id,
	        body: body.value
        }, function (e) {
            if (e.success) {
                alert('Replied!');
	            body.value = '';
            } else {
                error(e);
            }
            replyButton.show();
        });
    });
    content.add(replyButton);

    win.addEventListener('open', function () {
        body.focus();
    });

    win.open();
};
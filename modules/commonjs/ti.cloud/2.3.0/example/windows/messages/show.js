windowFunctions['Show Message'] = function (evt) {
    var win = createWindow();
    var offset = addBackButton(win);
    var content = Ti.UI.createScrollView({
        top: offset + u,
        contentHeight: 'auto',
        layout: 'vertical'
    });
    win.add(content);

    var status = Ti.UI.createLabel({
        text: 'Loading, please wait...', textAlign: 'left',
        height: 30 + u, left: 20 + u, right: 20 + u
    });
    content.add(status);

    Cloud.Messages.show({
        message_id: evt.id
    }, function (e) {
        content.remove(status);
	    if (e.success) {
		    if (evt.allowReply) {
		        var reply = Ti.UI.createButton({
		            title: 'Reply',
		            top: 10 + u, left: 10 + u, right: 10 + u, bottom: 10 + u,
		            height: 40 + u
		        });
		        reply.addEventListener('click', function () {
		            handleOpenWindow({ target: 'Reply Message', id: evt.id, subject: e.messages[0].subject });
		        });
		        content.add(reply);
		    }

	        var remove = Ti.UI.createButton({
	            title: 'Remove Message',
	            top: 10 + u, left: 10 + u, right: 10 + u, bottom: 10 + u,
	            height: 40 + u
	        });
	        remove.addEventListener('click', function () {
	            handleOpenWindow({ target: 'Remove Message', id: evt.id });
	        });
	        content.add(remove);

            enumerateProperties(content, e.messages[0], 20);
        } else {
            error(e);
        }
    });

    win.open();
};
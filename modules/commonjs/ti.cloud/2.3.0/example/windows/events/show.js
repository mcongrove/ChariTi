windowFunctions['Show Event'] = function (evt) {
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

    Cloud.Events.show({
        event_id: evt.id
    }, function (e) {
        content.remove(status);

        var update = Ti.UI.createButton({
            title: 'Update Event',
            top: 10 + u, left: 10 + u, right: 10 + u, bottom: 10 + u,
            height: 40 + u
        });
        update.addEventListener('click', function () {
            handleOpenWindow({ target: 'Update Event', id: evt.id });
        });
        content.add(update);

        var remove = Ti.UI.createButton({
            title: 'Remove Event',
            top: 10 + u, left: 10 + u, right: 10 + u, bottom: 10 + u,
            height: 40 + u
        });
        remove.addEventListener('click', function () {
            handleOpenWindow({ target: 'Remove Event', id: evt.id });
        });
        content.add(remove);

	    var occurrences = Ti.UI.createButton({
	        title: 'Show Occurrences',
	        top: 10 + u, left: 10 + u, right: 10 + u, bottom: 10 + u,
	        height: 40 + u
        });
        occurrences.addEventListener('click', function () {
            handleOpenWindow({ target: 'Show Event Occurrences', id: evt.id });
        });
        content.add(occurrences);

        if (e.success) {
            enumerateProperties(content, e.events[0], 20);
        } else {
            error(e);
        }
    });

    win.open();
};
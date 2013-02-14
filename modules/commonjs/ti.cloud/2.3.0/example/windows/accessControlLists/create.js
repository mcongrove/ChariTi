windowFunctions['Create ACL'] = function (evt) {
    var win = createWindow();
    var offset = addBackButton(win);
    var content = Ti.UI.createScrollView({
        top: offset + u,
        contentHeight: 'auto',
        layout: 'vertical'
    });
    win.add(content);

    var name = Ti.UI.createTextField({
        hintText: 'Name',
        top: 10 + u, left: 10 + u, right: 10 + u,
        height: 40 + u,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_NONE,
        autocorrect: false
    });
    content.add(name);

	var readers = { 
		publicAccess: false,
		ids: []
	};
    var readersButton = Ti.UI.createButton({
        title: 'Select Readers',
        top: 10 + u, left: 10 + u, right: 10 + u, bottom: 10 + u,
        height: 40 + u
    });
    readersButton.addEventListener('click', function submitForm() {
	    handleOpenWindow({ target: 'Select Users for ACL', access: readers });
    });
    content.add(readersButton);

	var writers = {
		publicAccess: false,
		ids: []
	};
    var writersButton = Ti.UI.createButton({
        title: 'Select Writers',
        top: 0, left: 10 + u, right: 10 + u, bottom: 10 + u,
        height: 40 + u
    });
    writersButton.addEventListener('click', function (evt) {
	    handleOpenWindow({ target: 'Select Users for ACL', access: writers });
    });
    content.add(writersButton);

    var createButton = Ti.UI.createButton({
        title: 'Create',
        top: 0, left: 10 + u, right: 10 + u, bottom: 10 + u,
        height: 40 + u
    });
    createButton.addEventListener('click', function (evt) {
    	if (name.value.length == 0) {
    		name.focus();
    		return;
    	}
    	createButton.hide();
        Cloud.ACLs.create({
            name: name.value,
            reader_ids: readers.ids.join(','),
            writer_ids: writers.ids.join(','),
            public_read: readers.publicAccess,
            public_write: writers.publicAccess
        }, function (e) {
            if (e.success) {
                alert('Created!');
            } else {
                error(e);
            }
            createButton.show();
        });
    });
    content.add(createButton);

    win.addEventListener('open', function () {
        name.focus();
    });
    win.open();
};
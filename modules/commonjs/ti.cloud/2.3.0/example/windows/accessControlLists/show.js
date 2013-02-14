windowFunctions['Show ACL'] = function (evt) {
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

    var showButton = Ti.UI.createButton({
        title: 'Show',
        top: 0, left: 10 + u, right: 10 + u, bottom: 10 + u,
        height: 40 + u
    });
    showButton.addEventListener('click', function (evt) {
    	if (name.value.length == 0) {
    		name.focus();
    		return;
    	}
    	Cloud.ACLs.show({
            name: name.value
        }, function (e) {
            if (e.success) {
            	var acls = e.acls[0];
            	readers.publicAccess = acls.public_read || false;
            	readers.ids = acls.readers || [];
            	writers.publicAccess = acls.public_write || false;
            	writers.ids = acls.writers || [];
            	alert('Shown!');
            } else {
                error(e);
            }
        });
    });
    content.add(showButton);   
    
    var updateButton = Ti.UI.createButton({
        title: 'Update',
        top: 0, left: 10 + u, right: 10 + u, bottom: 10 + u,
        height: 40 + u
    });
    updateButton.addEventListener('click', function (evt) {
        Cloud.ACLs.update({
            name: name.value,
            reader_ids: readers.ids.join(','),
            writer_ids: writers.ids.join(','),
            public_read: readers.publicAccess,
            public_write: writers.publicAccess
        }, function (e) {
            if (e.success) {
                alert('Updated!');
            } else {
                error(e);
            }
         });
    });
    content.add(updateButton);
    
    var removeButton = Ti.UI.createButton({
        title: 'Remove',
        top: 0, left: 10 + u, right: 10 + u, bottom: 10 + u,
        height: 40 + u
    });
    removeButton.addEventListener('click', function (evt) {
        Cloud.ACLs.remove({
            name: name.value
        }, function (e) {
            if (e.success) {
                alert('Removed!');
            } else {
                error(e);
            }
        });
    });
    content.add(removeButton);    
    
    win.addEventListener('open', function () {
        name.focus();
    });
    win.open();
};
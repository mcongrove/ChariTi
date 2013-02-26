windowFunctions['Create File'] = function (evt) {
    var win = createWindow();
    var offset = addBackButton(win);
    var content = Ti.UI.createScrollView({
        top: offset + u,
        contentHeight: 'auto',
        layout: 'vertical'
    });
    win.add(content);

	if (Ti.UI.createProgressBar) {
		var uploadProgress = Ti.UI.createProgressBar({
			 top: 10 + u, right: 10 + u, left: 10 + u,
			 max: 1, min: 0, value: 0,
			 height: 25 + u
		});
		content.add(uploadProgress);
		uploadProgress.show();
	}

    var name = Ti.UI.createTextField({
        hintText: 'Name',
        top: 10 + u, left: 10 + u, right: 10 + u,
        height: 40 + u,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED
    });
    content.add(name);

	var fileName = Ti.UI.createTextField({
		hintText: 'File name',
		top: 10 + u, left: 10 + u, right: 10 + u,
		height: 40 + u,
		borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		value: 'sampleFile.txt'
	});
	content.add(fileName);

    var button = Ti.UI.createButton({
        title: 'Create',
        top: 10 + u, left: 10 + u, right: 10 + u, bottom: 10 + u,
        height: 40 + u
    });
    content.add(button);

    function submitForm() {
        button.hide();
		if (Ti.UI.createProgressBar) {
			uploadProgress.value = 0;
			Cloud.onsendstream = function (evt) {
				uploadProgress.value = evt.progress * 0.5;
			};
			Cloud.ondatastream = function (evt) {
				uploadProgress.value = (evt.progress * 0.5) + 0.5;
			};
		}
        Cloud.Files.create({
	        name: name.value,
	        // The example file is located in the windows/files subfolder of the project resources
	        file: Titanium.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, 'windows/files/' + fileName.value)
        }, function (e) {
	        Cloud.onsendstream = Cloud.ondatastream = null;
            if (e.success) {
                alert('Created!');
                name.value = '';
            } else {
                error(e);
            }
            button.show();
        });
    }

    button.addEventListener('click', submitForm);
    var fields = [ name, fileName ];
    for (var i = 0; i < fields.length; i++) {
        fields[i].addEventListener('return', submitForm);
    }

    win.addEventListener('open', function () {
        name.focus();
    });
    win.open();
};
windowFunctions['Create Event'] = function (evt) {
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
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED
    });
    content.add(name);

    var date = Ti.UI.createTextField({
        hintText: 'Date',
        top: 10 + u, left: 10 + u, right: 10 + u,
        height: 40 + u,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED
    });
    content.add(date);

    var time = Ti.UI.createTextField({
        hintText: 'Time',
        top: 10 + u, left: 10 + u, right: 10 + u,
        height: 40 + u,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED
    });
    content.add(time);

    var duration = Ti.UI.createTextField({
        hintText: 'Duration (seconds)',
        top: 10 + u, left: 10 + u, right: 10 + u,
        height: 40 + u,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
	    keyboardType: Ti.UI.KEYBOARD_NUMBER_PAD
    });
    content.add(duration);

	var recurring = Ti.UI.createTextField({
		hintText: 'Recurring',
		top: 10 + u, left: 10 + u, right: 10 + u,
		height: 40 + u,
		borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_NONE
	});
	content.add(recurring);

    var recurringCount = Ti.UI.createTextField({
        hintText: 'Recurring Count (0-1000)',
        top: 10 + u, left: 10 + u, right: 10 + u,
        height: 40 + u,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        keyboardType: Ti.UI.KEYBOARD_NUMBER_PAD
    });
    content.add(recurringCount);

    var button = Ti.UI.createButton({
        title: 'Create',
        top: 10 + u, left: 10 + u, right: 10 + u, bottom: 10 + u,
        height: 40 + u
    });
    content.add(button);


    function submitForm() {
        button.hide();
	    var data = {
		    name: name.value
	    };
	    var value;
		value = Date.parse(date.value + ' ' + time.value);
	    if (isNaN(value)) {
		    alert("Please enter a valid date/time");
		    date.focus();
		    return;
	    }
		data.start_time = new Date(value);
	    value = parseInt(duration.value, 10);
	    if (!isNaN(value)) {
		    data.duration = value;
	    }
	    if (recurring.value.length > 0) {
		    data.recurring = recurring.value.toLowerCase();
		    var validValues = { daily:1, weekly:1, monthly:1, yearly:1};
		    if (!validValues[data.recurring]) {
			    alert("Enter 'daily', 'weekly', 'monthly', or 'yearly'");
			    recurring.focus();
			    return;
		    }
	    }
		value = parseInt(recurringCount.value, 10);
	    if (!isNaN(value)) {
		    data.recurring_count = value;
	    }

        Cloud.Events.create(data, function (e) {
            if (e.success) {
                alert('Created!');
                name.value = date.value = time.value = duration.value = recurring.value = recurringCount.value = '';
            } else {
                error(e);
            }
            button.show();
        });
    }

    button.addEventListener('click', submitForm);
    var fields = [ name, date, time, duration, recurring, recurringCount ];
    for (var i = 0; i < fields.length; i++) {
        fields[i].addEventListener('return', submitForm);
    }

    win.addEventListener('open', function () {
        name.focus();
    });
    win.open();
};
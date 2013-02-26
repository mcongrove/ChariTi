windowFunctions['Update Current User'] = function (evt) {
    var win = createWindow();
    var offset = addBackButton(win);
    var content = Ti.UI.createScrollView({
        top: offset + u,
        contentHeight: 'auto',
        layout: 'vertical'
    });
    win.add(content);

    var username = Ti.UI.createTextField({
        hintText: 'Username',
        top: 10 + u, left: 10 + u, right: 10 + u,
        height: 40 + u,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_NONE,
        autocorrect: false
    });
    content.add(username);

    var email = Ti.UI.createTextField({
        hintText: 'Email',
        top: 10 + u, left: 10 + u, right: 10 + u,
        height: 40 + u,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        keyboardType: Ti.UI.KEYBOARD_EMAIL
    });
    content.add(email);

    var password = Ti.UI.createTextField({
        hintText: 'Password',
        top: 10 + u, left: 10 + u, right: 10 + u,
        height: 40 + u,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        passwordMask: true
    });
    content.add(password);

    var confirmPassword = Ti.UI.createTextField({
        hintText: 'Confirm Password',
        top: 10 + u, left: 10 + u, right: 10 + u,
        height: 40 + u,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        passwordMask: true
    });
    content.add(confirmPassword);

    var firstName = Ti.UI.createTextField({
        hintText: 'First Name',
        top: 10 + u, left: 10 + u, right: 10 + u,
        height: 40 + u,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED
    });
    content.add(firstName);

    var lastName = Ti.UI.createTextField({
        hintText: 'Last Name',
        top: 10 + u, left: 10 + u, right: 10 + u,
        height: 40 + u,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED
    });
    content.add(lastName);

    var tags = Ti.UI.createTextField({
        hintText: 'Tags (csv)',
        top: 10 + u, left: 10 + u, right: 10 + u,
        height: 40 + u,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_NONE,
        autocorrect: false
    });
    content.add(tags);

    var button = Ti.UI.createButton({
        title: 'Update',
        top: 10 + u, left: 10 + u, right: 10 + u, bottom: 10 + u,
        height: 40 + u
    });
    content.add(button);

    var fields = [ username, email, password, confirmPassword, firstName, lastName, tags ];

    function submitForm() {
    	if (password.value != confirmPassword.value) {
    		alert('Password and Confirm Password do not match.');
            confirmPassword.focus();
            return;
        }

        for (var i = 0; i < fields.length; i++) {
            fields[i].blur();
        }

        button.hide();

    	var data = {
    		username: username.value,
    		email: email.value,
    		first_name: firstName.value,
    		last_name: lastName.value,
    		tags: tags.value
    	};
    	if (password.value.length > 0) {
    		data.password = password.value;
    		data.password_confirmation = confirmPassword.value;
    		password.value = confirmPassword.value = '';
    	} 
    	
        Cloud.Users.update(data, function (e) {
            if (e.success) {
                alert('Updated!');
            }
            else {
                error(e);
            }
            button.show();
        });
    }

    button.addEventListener('click', submitForm);
    for (var i = 0; i < fields.length; i++) {
        fields[i].addEventListener('return', submitForm);
    }

    var status = Ti.UI.createLabel({
        text: 'Loading, please wait...', textAlign: 'center',
        top: offset + u, right: 0, bottom: 0, left: 0,
        backgroundColor: '#fff', zIndex: 2
    });
    win.add(status);

    win.addEventListener('open', function () {
        Cloud.Users.showMe(function (e) {
            status.hide();
            if (e.success) {
                var user = e.users[0];
                username.value = user.username;
                email.value = user.email;
                firstName.value = user.first_name;
                lastName.value = user.last_name;
                tags.value = user.tags && user.tags.join(',');
                username.focus();
            }
            else {
                error(e);
            }
        });
    });
    win.open();
};
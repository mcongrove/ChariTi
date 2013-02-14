windowFunctions['Secure Identity'] = function (evt) {
    var win = createWindow();
    var offset = addBackButton(win);
    var content = Ti.UI.createScrollView({
        top: offset + u,
        contentHeight: 'auto',
        layout: 'vertical'
    });
    win.add(content);

	var btnSecureCreate = Ti.UI.createButton({
		title: 'Secure Create',
        top: 10 + u, left: 10 + u, right: 10 + u, bottom: 10 + u,
        height: 40 + u
	});
	content.add(btnSecureCreate);
	btnSecureCreate.addEventListener('click', secureCreate);

	var btnSecureLogin = Ti.UI.createButton({
		title: 'Secure Login',
        top: 10 + u, left: 10 + u, right: 10 + u, bottom: 10 + u,
        height: 40 + u
	});
	content.add(btnSecureLogin);
	btnSecureLogin.addEventListener('click', secureLogin);

	var btnLogoff = Ti.UI.createButton({
		title: 'Logoff',
        top: 10 + u, left: 10 + u, right: 10 + u, bottom: 10 + u,
        height: 40 + u
	});
	content.add(btnLogoff);
	btnLogoff.addEventListener('click', logoff);

	var btnCheckStatus = Ti.UI.createButton({
		title: 'Check Status',
        top: 10 + u, left: 10 + u, right: 10 + u, bottom: 10 + u,
        height: 40 + u
	});
	content.add(btnCheckStatus);
	btnCheckStatus.addEventListener('click', secureCheckStatus);

	function secureCreate() {
		Cloud.Users.secureCreate({
				title: 'Sign up here'
			}, function(e) {
				if (e.success) {
					getMe('Created!');
				} else {
					error(e);
				}
			}
		);
	}

	function secureLogin() {
		Cloud.Users.secureLogin({
				//title: 'Secure Login'
			}, function(e) {
				if (e.success) {
					getMe('Logged In!');
				} else {
					error(e);
				}
			}
		);
	}

	function secureCheckStatus() {
		if (Cloud.Users.secureStatus()) {
			alert ("Logged in");
		} else {
			alert ("Logged out");
		}
	}
	function logoff() {
		Cloud.Users.logout(function(e) {
			if (e.success) {
				alert ("Logged out!");
			} else {
				error(e);
			}
		});
	}

	function getMe(action) {
		Cloud.Users.showMe(function (e) {
            if (e.success) {
	            var user = e.users[0];
				alert(action + 'You are now logged in as ' + user.id);
            } else {
                error(e);
            }
        });
	}

    win.open();
};

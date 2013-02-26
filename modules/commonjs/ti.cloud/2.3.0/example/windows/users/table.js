Ti.include(
    'loginStatus.js',
    'create.js',
    'login.js',
    'logout.js',
    'query.js',
    'remove.js',
    'requestResetPassword.js',
    'search.js',
    'show.js',
    'showMe.js',
    'update.js',
	'secureIdentity.js'
);

windowFunctions['Users'] = function (evt) {
    var win = createWindow();
    var offset = addBackButton(win);
    var table = Ti.UI.createTableView({
        backgroundColor: '#fff',
        top: offset + u,
        data: createRows([
            'Login Status',
            'Create User',
            'Login User',
	        'Secure Identity',
            'Request Reset Password',
            'Show Current User',
            'Update Current User',
            'Remove Current User',
            'Logout Current User',
            'Query User',
            'Search User'
        ])
    });
    table.addEventListener('click', handleOpenWindow);
    win.add(table);
    win.open();
};
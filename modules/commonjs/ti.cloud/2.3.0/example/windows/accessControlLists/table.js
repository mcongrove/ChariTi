Ti.include(
    'create.js',
    'show.js',
    'checkUser.js',
    'selectUsers.js',
    'updateUsers.js'
);

windowFunctions['Access Control Lists'] = function (evt) {
    var win = createWindow();
    var offset = addBackButton(win);
    var table = Ti.UI.createTableView({
        backgroundColor: '#fff',
        top: offset + u,
        data: createRows([
            'Create ACL',
            'Show ACL',
            'Update Users in ACL',
            'Check Permission of ACL'
        ])
    });
    table.addEventListener('click', handleOpenWindow);
    win.add(table);
    win.open();
};
Ti.include(
    'create.js',
	'query.js',
	'show.js',
	'remove.js',
	'update.js'
);

windowFunctions['Files'] = function (evt) {
    var win = createWindow();
    var offset = addBackButton(win);
    var table = Ti.UI.createTableView({
        backgroundColor: '#fff',
        top: offset + u,
        data: createRows([
            'Create File',
	        'Query Files'
        ])
    });
    table.addEventListener('click', handleOpenWindow);
    win.add(table);
    win.open();
};
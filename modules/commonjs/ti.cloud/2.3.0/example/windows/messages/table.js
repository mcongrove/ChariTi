Ti.include(
    'create.js',
	'selectUsers.js',
	'showInbox.js',
	'showSent.js',
	'showThreads.js',
	'showThreadMessages.js',
	'show.js',
	'remove.js',
	'removeThread.js',
	'reply.js'
);

windowFunctions['Messages'] = function (evt) {
    var win = createWindow();
    var offset = addBackButton(win);
    var table = Ti.UI.createTableView({
        backgroundColor: '#fff',
        top: offset + u,
        data: createRows([
            'Create Message',
	        'Show Inbox',
	        'Show Sent',
	        'Show Threads'
        ])
    });
    table.addEventListener('click', handleOpenWindow);
    win.add(table);
    win.open();
};
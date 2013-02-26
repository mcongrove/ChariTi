Ti.include(
    'create.js',
	'show.js',
	'showOccurrences.js',
	'search.js',
	'query.js',
	'queryOccurrences.js',
	'searchOccurrences.js',
	'update.js',
	'remove.js'
);

windowFunctions['Events'] = function (evt) {
    var win = createWindow();
    var offset = addBackButton(win);
    var table = Ti.UI.createTableView({
        backgroundColor: '#fff',
        top: offset + u,
        data: createRows([
            'Create Event',
	        'Query Events',
	        'Query Event Occurrences',
	        'Search Events',
	        'Search Event Occurrences'
        ])
    });
    table.addEventListener('click', handleOpenWindow);
    win.add(table);
    win.open();
};
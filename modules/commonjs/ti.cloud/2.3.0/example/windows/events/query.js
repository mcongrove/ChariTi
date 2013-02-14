windowFunctions['Query Events'] = function (evt) {
    var win = createWindow();
    var offset = addBackButton(win);

    var table = Ti.UI.createTableView({
        backgroundColor: '#fff',
        top: offset + u, bottom: 0,
        data: [
            { title: 'Loading, please wait...' }
        ]
    });

    table.addEventListener('click', function (evt) {
        if (evt.row.id) {
	        handleOpenWindow({ target: 'Show Event', id: evt.row.id });
        }
    });
    win.add(table);

    function queryEvents() {
        Cloud.Events.query(function (e) {
            if (e.success) {
	            if (e.events.length == 0) {
                    table.setData([
                        { title: 'No events' }
                    ]);
                } else {
	                var data = [];
		            for (var i = 0, l = e.events.length; i < l; i++) {
              	        var event = e.events[i];
                        var row = Ti.UI.createTableViewRow({
                            title: event.name,
                            id: event.id
                        });
                        data.push(row);
                    }
		            table.setData(data);
	            }
            } else {
                table.setData([
                    { title: (e.error && e.message) || e }
                ]);
                error(e);
            }
        })
    }

    win.addEventListener('open', queryEvents);
    win.open();
};
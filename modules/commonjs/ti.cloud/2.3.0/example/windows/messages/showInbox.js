windowFunctions['Show Inbox'] = function (evt) {
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
	        handleOpenWindow({ target: 'Show Message', id: evt.row.id, allowReply: true });
        }
    });
    win.add(table);

    function showInbox() {
        Cloud.Messages.showInbox(function (e) {
            if (e.success) {
	            if (e.messages.length == 0) {
                    table.setData([
                        { title: 'No messages' }
                    ]);
                } else {
	                var data = [];
		            for (var i = 0, l = e.messages.length; i < l; i++) {
              	        var message = e.messages[i];
                        var row = Ti.UI.createTableViewRow({
                            title: message.subject,
                            id: message.id
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

    win.addEventListener('open', showInbox);
    win.open();
};
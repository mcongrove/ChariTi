windowFunctions['Show Messages In Thread'] = function (evt) {
    var win = createWindow();
    var offset = addBackButton(win);
	var threadId = evt.id;

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
        } else {
	        handleOpenWindow({ target: 'Remove All Thread Messages', id: threadId });
        }
    });
    win.add(table);

    function showThreadMessages() {
        Cloud.Messages.showThread({
	        thread_id: threadId
        }, function (e) {
            if (e.success) {
	            if (e.messages.length == 0) {
                    table.setData([
                        { title: 'No messages' }
                    ]);
                } else {
	                var data = [];
		            data.push({ title:'Remove all messages' });
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

    win.addEventListener('open', showThreadMessages);
    win.open();
};
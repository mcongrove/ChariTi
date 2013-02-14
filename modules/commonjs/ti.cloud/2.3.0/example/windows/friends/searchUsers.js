windowFunctions['Search Friends'] = function (evt) {
    var win = createWindow();
    var offset = addBackButton(win);

	var checked = [];

    var table = Ti.UI.createTableView({
        backgroundColor: '#fff',
        top: offset + u, bottom: 0,
        data: [
            { title: 'Loading, please wait...' }
        ]
    });

    table.addEventListener('click', function (evt) {
        if (evt.row.id) {
	        handleOpenWindow({ target: 'Search Friends of User', id: evt.row.id });
        }
    });
    win.add(table);

    function queryUsers() {
        Cloud.Users.query(function (e) {
            if (e.success) {
                var data = [];
                for (var i = 0, l = e.users.length; i < l; i++) {
                    var user = e.users[i];
                    var row = Ti.UI.createTableViewRow({
                        title: user.first_name + ' ' + user.last_name,
                        id: user.id
                    });
                    data.push(row);
                }
	            table.setData(data);
            }
            else {
                table.setData([
                    { title: (e.error && e.message) || e }
                ]);
                error(e);
            }
        })
    }

    win.addEventListener('open', queryUsers);
    win.open();
};
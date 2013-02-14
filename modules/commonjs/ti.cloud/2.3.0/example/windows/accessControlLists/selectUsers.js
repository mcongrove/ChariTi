windowFunctions['Select Users for ACL'] = function (evt) {
    var win = createWindow();
    var offset = addBackButton(win);
	var access = evt.access;

    var table = Ti.UI.createTableView({
        backgroundColor: '#fff',
        top: offset + u, bottom: 0,
        data: [
            { title: 'Loading, please wait...' }
        ]
    });
    table.addEventListener('click', function (evt) {
        if (evt.row.id) {
            evt.row.hasCheck = !evt.row.hasCheck;
            if (evt.row.id === 'publicAccess') {
            	access.publicAccess = evt.row.hasCheck;
            } else if (evt.row.hasCheck) {
            	access.ids.push(evt.row.id);
            } else {
            	access.ids.splice(access.ids.indexOf(evt.row.id),1);
            }
        }
    });
    win.add(table);

    function queryUsers() {
        Cloud.Users.query(function (e) {
            if (e.success) {
                if (e.users.length == 0) {
                    table.setData([
                        { title: 'No Users!' }
                    ]);
                }
                else {
                    var data = [];
                    if (typeof access.publicAccess != 'undefined') {
                    	data.push({ title: '<Public Access>', id: 'publicAccess', hasCheck: access.publicAccess || false });
                    }    
                    for (var i = 0, l = e.users.length; i < l; i++) {
                        var user = e.users[i];
                        var row = Ti.UI.createTableViewRow({
                            title: user.first_name + ' ' + user.last_name,
                            id: user.id
                        });
                        row.hasCheck = access.ids.indexOf(user.id) != -1;
                        data.push(row);
                    }
                    table.setData(data);
                }
            }
            else {
                table.setData([
                    { title: (e.error && e.message) || e }
                ]);
                error(e);
            }
        })
    }

    win.addEventListener('open', function () {
        queryUsers();
    });
    win.open();
};
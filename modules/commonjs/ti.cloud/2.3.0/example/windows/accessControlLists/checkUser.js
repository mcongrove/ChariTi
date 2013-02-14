windowFunctions['Check Permission of ACL'] = function (evt) {
    var win = createWindow();
    var offset = addBackButton(win);
    var content = Ti.UI.createScrollView({
        top: offset + u,
        contentHeight: 'auto',
        layout: 'vertical'
    });
    win.add(content);

    var name = Ti.UI.createTextField({
        hintText: 'Name',
        top: 10 + u, left: 10 + u, right: 10 + u,
        height: 40 + u,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_NONE,
        autocorrect: false
    });
    content.add(name);

    var table = Ti.UI.createTableView({
        backgroundColor: '#fff',
        top: offset + u, bottom: 0,
        data: [
            { title: 'Loading, please wait...' }
        ]
    });
    table.addEventListener('click', function (evt) {
   		if (name.value.length == 0) {
    		name.focus();
    		return;
    	}
        if (evt.row.id) {
    		Cloud.ACLs.checkUser({
    			name: name.value,
            	user_id: evt.row.id
        	}, function (e) {
            	if (e.success) {
					alert('Read Permission: ' + (e.permission['read permission'] || 'no') +  
						  '\nWrite Permission: ' + (e.permission['write permission'] || 'no'));
            	} else {
                	error(e);
            	}
        	});
        }
    });
    content.add(table);

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
/**
 * Controller for the share contacts list screen
 * 
 * @class Controllers.share.contacts
 * @uses core
 */
var APP = require("core");

var CONFIG = arguments[0];
var SELECTED = [];

$.init = function() {
	APP.log("debug", "share_contacts.init | " + JSON.stringify(CONFIG));

	if(Ti.Contacts.contactsAuthorization == Ti.Contacts.AUTHORIZATION_AUTHORIZED) {
		$.loadData();
	} else if(Ti.Contacts.contactsAuthorization == Ti.Contacts.AUTHORIZATION_UNKNOWN) {
		Ti.Contacts.requestAuthorization(function(_event) {
			if(_event.success) {
				$.loadData();
			} else {
				$.createEmail();
			}
		});
	} else {
		$.createEmail();
	}

	$.NavigationBar.setBackgroundColor(APP.Settings.colors.primary || "#000");

	if(APP.Device.isHandheld) {
		$.NavigationBar.showBack({
			callback: function(_event) {
				APP.removeAllChildren();
			}
		});
	}

	$.NavigationBar.showNext({
		callback: function() {
			$.createEmail(SELECTED);
		}
	});
};

$.loadData = function() {
	APP.log("debug", "share_contacts.loadData");

	var contacts = $.getContacts();
	var emails = $.getEmails(contacts);
	var rows = [];
	var index = [];
	var letter = "";

	for(var i = 0, x = emails.length; i < x; i++) {
		if(OS_IOS) {
			var firstLetter = emails[i].name.substr(0, 1).toUpperCase();
			var header = false;

			if(firstLetter !== letter) {
				letter = firstLetter;

				index.push({
					title: letter,
					index: i
				});

				header = letter;
			}
		}

		var row = Alloy.createController("share_contacts_row", {
			id: emails[i].email,
			heading: emails[i].name,
			subHeading: emails[i].email,
			header: OS_IOS && header ? header : false
		}).getView();

		rows.push(row);
	}

	$.container.setData(rows);

	$.container.index = index;
};

$.getContacts = function() {
	APP.log("debug", "share_contacts.getAddresses");

	var items = Ti.Contacts.getAllPeople();
	var contacts = [];

	for(var i = 0, x = items.length; i < x; i++) {
		var person = items[i];

		if(person.email) {
			contacts.push({
				name: person.fullName,
				email: person.email
			});
		}
	}

	contacts.sort(function(a, b) {
		a = a.name.toLowerCase();
		b = b.name.toLowerCase();

		if(a < b) {
			return -1;
		} else if(a > b) {
			return 1;
		} else {
			return 0;
		}
	});

	return contacts;
};

$.getEmails = function(_contacts) {
	var emails = [];

	for(var i = 0, z = _contacts.length; i < z; i++) {
		var contact = _contacts[i];

		for(var type in contact.email) {
			emails.push({
				name: contact.name,
				email: contact.email[type][0]
			});
		}
	}

	return emails;
};

$.createEmail = function(_addresses) {
	APP.log("debug", "share_contacts.createEmail");

	var email = Ti.UI.createEmailDialog({
		barColor: APP.Settings.colors.primary || "#000"
	});

	if(_addresses) {
		email.bccRecipients = _addresses;
	}

	email.html = true;
	email.subject = CONFIG.title;
	email.messageBody = CONFIG.text;

	email.addEventListener("complete", function(_event) {
		if(APP.Device.isTablet) {
			APP.removeChild();
		} else {
			APP.removeAllChildren();
		}
	});

	email.open();
};

// Event listeners
$.container.addEventListener("click", function(_event) {
	APP.log("debug", "share_contacts @click " + _event.row.id);

	if(SELECTED.indexOf(_event.row.id) === -1) {
		SELECTED.push(_event.row.id);
	} else {
		SELECTED.splice(SELECTED.indexOf(_event.row.id), 1);
	}
});

// Kick off the init
$.init();
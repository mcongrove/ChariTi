var APP		= require("core");
var UTIL	= require("utilities");
var MODEL	= require("models/twitter");

var CONFIG	= arguments[0];

var offset			= 0;
var refreshLoading	= false;
var refreshEngaged	= false;

$.init = function() {
	APP.log("debug", "twitter.init | " + JSON.stringify(CONFIG));
	
	APP.openLoading();
	
	$.NavigationBar.Wrapper.backgroundColor = APP.Settings.colors.primary || "#000";
	$.NavigationBar.right.visible			= true;
	$.NavigationBar.rightImage.image		= "/images/settings.png";

	if (CONFIG.isChild === true) {
		$.NavigationBar.back.visible		= true;
	}
	
	MODEL.fetch({
		url: "https://api.twitter.com/1/statuses/user_timeline.json?trim_user=true&include_rts=false&exclude_replies=true&count=50&screen_name=" + CONFIG.username,
		cache: CONFIG.cache,
		callback: function() {
			$.handleData(MODEL.getTweets());
		}
	});
	
	var initRefresh = setInterval(function(_event) {
		if(offset > 30) {
			clearInterval(initRefresh);
		}
		
		$.container.scrollTo(0, 60);
	}, 100);
};

$.handleData = function(_data) {
	APP.log("debug", "twitter.handleData");
	
	var rows = [];
	
	for(var i = 0, x = _data.length; i < x; i++) {
		var row = Alloy.createController("twitter_row", {
			id: _data[i].id,
			heading: _data[i].text,
			subHeading: UTIL.toDateRelative(_data[i].date),
			username: CONFIG.username
		}).getView();
		
		rows.push(row);
	}
	
	$.content.setData(rows);
	
	APP.closeLoading();
};

// Event listeners

$.NavigationBar.back.addEventListener("click", function(_event) {
	APP.log("debug", "twitter @close");
	
	APP.closeDetailScreen();
});

$.NavigationBar.right.addEventListener("click", function(_event) {
	APP.openSettings();
});

$.container.addEventListener("scroll", function(_event) {
	if(_event.y !== null) {
		offset = _event.y;
		
		if(!refreshLoading) {
			var transform	= Ti.UI.create2DMatrix();
			
			if(offset < 0) {
				if(refreshEngaged == false) {
					$.refreshLabel.text = "Release to reload...";
					
					transform = transform.rotate(-180);
				
					$.refreshArrow.animate({
						transform: transform,
						duration: 100
					});
					
					refreshEngaged = true;
				}
			} else {
				if(refreshEngaged == true) {
					$.refreshLabel.text = "Pull down to update...";
					
					$.refreshArrow.animate({
						transform: transform,
						duration: 100
					});
					
					refreshEngaged = false;
				}
			}
		}
	}
});

$.container.addEventListener("dragend", function(_event) {
	if(offset < 0) {
		refreshLoading = true;
		
		$.refreshLabel.text			= "Loading new content...";
		$.refreshArrow.visible		= false;
		$.refreshLoading.visible	= true;
		
		$.refreshLoading.start();
		
		MODEL.fetch({
			url: "https://api.twitter.com/1/statuses/user_timeline.json?trim_user=true&include_rts=false&exclude_replies=true&count=50&screen_name=" + CONFIG.username,
			cache: 0,
			callback: function() {
				$.handleData(MODEL.getTweets());
				
				refreshLoading = false;
				
				$.container.scrollTo(0, 60);
				
				$.refreshArrow.visible		= true;
				$.refreshLoading.visible	= false;
			}
		});
	} else if(offset < 60 && !refreshLoading) {
		$.container.scrollTo(0, 60);	
	}
});

// Kick off the init
$.init();
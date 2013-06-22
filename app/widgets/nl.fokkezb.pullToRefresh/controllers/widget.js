var CONFIG = arguments[0] || {};

var options = null;
var initted = false;
var pulling = false;
var pulled = false;
var loading = false;
var offset = 0;

exports.init = function(_params) {
	if(initted) {
		return false;
	}

	options = _.defaults(_params, {
		backgroundColor: "#FFF",
		fontColor: "#AAA",
		indicator: "PLAIN"
	});

	$.headerPullView.backgroundColor = options.backgroundColor;
	
	switch(options.indicator.toLowerCase()) {
		case "plain":
			$.activityIndicator.style = Ti.UI.iPhone.ActivityIndicatorStyle.PLAIN;
			break;
		case "dark":
			$.activityIndicator.style = Ti.UI.iPhone.ActivityIndicatorStyle.DARK;
			break;
	}

	options.table.setHeaderPullView($.headerPullView);

	options.table.addEventListener("scroll", scrollListener);
	options.table.addEventListener("dragEnd", dragEndListener);
};

exports.show = function(_message) {
	if(pulled) {
		return false;
	}

	pulled = true;
	
	$.status.animate({
		bottom: 50,
		opacity: 0,
		duration: 200
	}, function(_event) {
		$.status.opacity = 0;
		$.status.bottom = 50;
		
		$.activityIndicator.show();
		
		$.activityIndicator.animate({
			bottom: 25,
			opacity: 1,
			duration: 100
		}, function(_event) {
			$.activityIndicator.opacity = 1;
			$.activityIndicator.bottom = 25;
		});
	});

	options.table.setContentInsets(
		{ top: 80 },
		{ animated: true }
	);

	return true;
};

exports.hide = function() {
	if(!pulled) {
		return false;
	}

	options.table.setContentInsets(
		{ top: 0 },
		{ animated: true }
	);
	
	$.status.text = "Pull to Refresh";
	
	$.activityIndicator.animate({
		bottom: 50,
		opacity: 0,
		duration: 100
	}, function(_event) {
		$.activityIndicator.opacity = 0;
		$.activityIndicator.bottom = 50;
		
		$.activityIndicator.hide();
		
		$.status.animate({
			bottom: 25,
			opacity: 1,
			duration: 200
		}, function(_event) {
			$.status.opacity = 1;
			$.status.bottom = 25;
		});
	});

	pulled = false;
	loading = false;
};

exports.trigger = function() {
	if(loading) {
		return false;
	}

	loading = true;

	exports.show();

	options.refresh(finishLoading);
};

exports.remove = function() {
	if(!initted) {
		return false;
	}

	options.table.setHeaderPullView(null);

	options.table.removeEventListener("scroll", scrollListener);
	options.table.removeEventListener("dragEnd", dragEndListener);

	options = null;
	initted = false;
	pulling = false;
	loading = false;
	shown = false;
	offset = 0;
};

function finishLoading(_update) {
	exports.hide();

	loading = false;
}

function scrollListener(_event) {
	offset = _event.contentOffset.y;

	if(pulled) {
		return;
	}

	if(pulling && !loading && offset > -80 && offset < 0) {
		pulling = false;
		
		$.status.text = "Pull to Refresh";
	} else if(!pulling && !loading && offset < -80) {
		pulling = true;
		
		$.status.text = "Release to Refresh";
	}
}

function dragEndListener(_event) {
	if(!pulled && pulling && !loading && offset < -80) {
		pulling = false;

		exports.trigger();
	}
}

if(CONFIG.table && CONFIG.refresh) {
	exports.init(CONFIG);
}
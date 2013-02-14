var APP = require("core");
var SOCIAL = require("social");
var DATE = require("alloy/moment");
var MODEL = require("models/podcast")();

var CONFIG = arguments[0] || {};
var ACTION = {};
var STREAM;

$.init = function() {
	APP.log("debug", "podcast_podcast.init | " + JSON.stringify(CONFIG));

	MODEL.init(CONFIG.index);

	$.handleData(MODEL.getPodcast(CONFIG.id));
};

$.handleData = function(_data) {
	APP.log("debug", "podcast_podcast.handleData");

	$.handleNavigation(_data.id);
	$.createAudioPlayer(_data.url);

	$.artwork.image = _data.image;
	$.title.text = _data.title;

	ACTION.url = _data.url;

	$.NavigationBar.setBackgroundColor(APP.Settings.colors.primary || "#000");

	if(APP.Device.isHandheld) {
		$.NavigationBar.showBack({
			callback: function(_event) {
				$.streamStop();

				APP.removeAllChildren();
			}
		});
	}

	$.NavigationBar.showAction({
		callback: function(_event) {
			SOCIAL.share(ACTION.url, $.NavigationBar.right);
		}
	});
};

$.createAudioPlayer = function(_url) {
	APP.log("debug", "podcast_podcast.createAudioPlayer(" + _url + ")");

	Ti.Media.audioSessionMode = Ti.Media.AUDIO_SESSION_MODE_PLAYBACK;

	STREAM = Ti.Media.createVideoPlayer({
		url: _url,
		backgroundColor: "#000",
		fullscreen: false,
		allowsAirPlay: true,
		mediaControlStyle: Ti.Media.VIDEO_CONTROL_NONE,
		mediaTypes: Ti.Media.VIDEO_MEDIA_TYPE_AUDIO,
		repeatMode: Ti.Media.VIDEO_REPEAT_MODE_NONE,
		sourceType: Ti.Media.VIDEO_SOURCE_TYPE_STREAMING,
		useApplicationAudioSession: true,
		visible: false
	});

	STREAM.addEventListener("playbackstate", $.streamState);
	STREAM.addEventListener("loadstate", $.streamPlay);

	setInterval($.streamProgress, 500);
};

$.handleNavigation = function(_id) {
	ACTION.next = MODEL.getNextPodcast(_id);
	ACTION.previous = MODEL.getPreviousPodcast(_id);

	var navigation = Alloy.createWidget("com.chariti.detailNavigation", null, {
		down: function(_event) {
			APP.log("debug", "podcast_podcast @next");

			$.streamStop();

			APP.addChild("podcast_podcast", {
				id: ACTION.next.id,
				index: CONFIG.index
			});
		},
		up: function(_event) {
			APP.log("debug", "podcast_podcast @previous");

			$.streamStop();

			APP.addChild("podcast_podcast", {
				id: ACTION.previous.id,
				index: CONFIG.index
			});
		}
	}).getView();

	$.NavigationBar.addNavigation(navigation);
};

$.streamPlay = function(_event) {
	STREAM.play();
};

$.streamPause = function(_event) {
	STREAM.pause();
};

$.streamStop = function() {
	STREAM.stop();
	STREAM.release();
};

$.streamSeek = function(_event) {
	var x = _event.x;
	var width = $.track.rect.width;
	var percentage = x / width;
	var position = Math.round(STREAM.getDuration() * percentage);

	STREAM.setCurrentPlaybackTime(position);

	$.position.width = (percentage * 100) + "%";
};

function secondsToString(seconds) {
	var numhours = Math.round(Math.floor(((seconds % 31536000) % 86400) / 3600));
	var numminutes = Math.round(Math.floor((((seconds % 31536000) % 86400) % 3600) / 60));
	var numseconds = Math.round((((seconds % 31536000) % 86400) % 3600) % 60);
	return((numhours !== 0) ? numhours + ':' : '') + numminutes + ':' + (((numseconds < 10) ? '0' : '') + numseconds);
}

$.streamProgress = function(_event) {
	if(STREAM.playbackState == Ti.Media.VIDEO_PLAYBACK_STATE_PLAYING) {
		var percentage = (STREAM.currentPlaybackTime / STREAM.getDuration()) * 100;

		percentage = percentage >= 1 ? percentage : 1;

		$.position.width = percentage + "%";

		$.time.text = secondsToString(STREAM.currentPlaybackTime / 1000);
	}
};

$.streamState = function(_event) {
	if(_event.playbackState == Ti.Media.VIDEO_PLAYBACK_STATE_PLAYING) {
		$.play.visible = false;
		$.pause.visible = true;
	} else {
		$.pause.visible = false;
		$.play.visible = true;
	}
};

// Event listeners
$.play.addEventListener("click", $.streamPlay);
$.pause.addEventListener("click", $.streamPause);
$.track.addEventListener("click", $.streamSeek);

$.previous.addEventListener("click", function(_event) {
	APP.log("debug", "podcast_podcast @previous");

	$.streamStop();

	APP.addChild("podcast_podcast", {
		id: ACTION.previous.id,
		index: CONFIG.index
	});
});

$.next.addEventListener("click", function(_event) {
	APP.log("debug", "podcast_podcast @next");

	$.streamStop();

	APP.addChild("podcast_podcast", {
		id: ACTION.next.id,
		index: CONFIG.index
	});
});

// Kick off the init
$.init();
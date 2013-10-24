/**
 * Controller for the podcast node screen
 * 
 * @class Controllers.podcast.podcast
 * @uses Models.podcast
 * @uses core
 * @uses social
 */
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

	$.position.backgroundColor = APP.Settings.colors.primary || "#000";
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

	var filename = _url.substring(_url.lastIndexOf("/") + 1, _url.lastIndexOf(".mp3")) + '.mp3';
	var directory;

	if(OS_ANDROID) {
		directory = Ti.Filesystem.getFile(Ti.Filesystem.externalStorageDirectory);
	} else {
		directory = Ti.Filesystem.applicationDataDirectory;
	}

	var file = Ti.Filesystem.getFile(directory, filename);
	var filepath;

	if(file.exists()) {
		filepath = file.getNativePath();

		$.disableDownload();
	} else {
		filepath = _url;
	}

	Ti.Media.audioSessionMode = Ti.Media.AUDIO_SESSION_MODE_PLAYBACK;

	STREAM = Ti.Media.createVideoPlayer({
		url: filepath,
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

	STREAM.addEventListener("loadstate", function(_event) {
		var duration = DATE.duration(STREAM.getDuration());
		$.duration.text = (duration.hours() !== 0 ? duration.hours() + ":" : "") + duration.minutes() + ":" + (duration.seconds() < 10 ? "0" : "") + duration.seconds();

		$.streamPlay();
	});

	setInterval($.streamProgress, 500);

	$.playerContainer.add(STREAM);
};

$.downloadRemoteFile = function() {
	MODEL.downloadPodcast(ACTION.url);

	$.disableDownload();
};

$.disableDownload = function() {
	$.download.touchEnabled = false;
	$.download.opacity = 0.4;
};

$.handleNavigation = function(_id) {
	ACTION.next = MODEL.getNextPodcast(_id);
	ACTION.previous = MODEL.getPreviousPodcast(_id);
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

$.streamProgress = function(_event) {
	if(STREAM.playbackState == Ti.Media.VIDEO_PLAYBACK_STATE_PLAYING) {
		var percentage = ((STREAM.currentPlaybackTime / STREAM.getDuration()) * 100);
		var time = DATE.duration(STREAM.currentPlaybackTime);

		percentage = percentage >= 1 ? percentage : 1;

		$.position.width = percentage + "%";
		$.time.text = (time.hours() !== 0 ? time.hours() + ":" : "") + time.minutes() + ":" + (time.seconds() < 10 ? "0" : "") + time.seconds();
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
$.download.addEventListener("click", $.downloadRemoteFile);

$.previous.addEventListener("click", function(_event) {
	APP.log("debug", "podcast_podcast @previous");

	$.streamStop();

	APP.addChild("podcast_podcast", {
		id: ACTION.previous.id,
		index: CONFIG.index
	}, false, true);
});

$.next.addEventListener("click", function(_event) {
	APP.log("debug", "podcast_podcast @next");

	$.streamStop();

	APP.addChild("podcast_podcast", {
		id: ACTION.next.id,
		index: CONFIG.index
	}, false, true);
});

// Kick off the init
$.init();
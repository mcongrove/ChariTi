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

/**
 * Initializes the controller
 */
$.init = function() {
	APP.log("debug", "podcast_podcast.init | " + JSON.stringify(CONFIG));

	MODEL.init(CONFIG.index);

	$.handleData(MODEL.getPodcast(CONFIG.id));

	$.position.backgroundColor = APP.Settings.colors.primary;
};

/**
 * Handles the data return
 * @param {Object} _data The returned data
 */
$.handleData = function(_data) {
	APP.log("debug", "podcast_podcast.handleData");

	$.createAudioPlayer(_data.url);

	$.artwork.image = _data.image;
	$.title.text = _data.title;

	ACTION.url = _data.url;
	ACTION.next = MODEL.getNextPodcast(_data.id);
	ACTION.previous = MODEL.getPreviousPodcast(_data.id);

	$.NavigationBar.setBackgroundColor(APP.Settings.colors.primary);

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

/**
 * Creates an audio player
 * @param {Object} _url The remote URL of the audio
 */
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
		if(_event.loadState == Ti.Media.VIDEO_LOAD_STATE_PLAYABLE) {
			var duration = DATE.duration(STREAM.getDuration());
			$.duration.text = (duration.hours() !== 0 ? duration.hours() + ":" : "") + duration.minutes() + ":" + (duration.seconds() < 10 ? "0" : "") + duration.seconds();

			$.streamPlay();
		}
	});

	setInterval($.streamProgress, 500);

	$.playerContainer.add(STREAM);
};

/**
 * Downloads the audio file from the remote source
 */
$.downloadRemoteFile = function() {
	Alloy.createWidget("com.chariti.toast", null, {
		text: "Starting Download",
		duration: 2000,
		view: APP.GlobalWrapper
	});

	MODEL.downloadPodcast({
		url: ACTION.url,
		callback: function(_event) {
			Alloy.createWidget("com.chariti.toast", null, {
				text: "Download Complete",
				duration: 2000,
				view: APP.GlobalWrapper
			});
		}
	});

	$.disableDownload();
};

/**
 * Disables the download option
 */
$.disableDownload = function() {
	$.download.touchEnabled = false;
	$.download.opacity = 0.4;
};

/**
 * Plays the audio stream
 * @param {Object} _event The stream event
 */
$.streamPlay = function(_event) {
	STREAM.play();
};

/**
 * Pauses the audio stream
 * @param {Object} _event The stream event
 */
$.streamPause = function(_event) {
	STREAM.pause();
};

/**
 * Stops the audio stream
 * @param {Object} _event The stream event
 */
$.streamStop = function() {
	STREAM.stop();
	STREAM.release();
};

/**
 * Seeks the audio stream
 * @param {Object} _event The stream event
 */
$.streamSeek = function(_event) {
	var x = _event.x;
	var width = $.track.rect.width;
	var percentage = x / width;
	var position = Math.round(STREAM.getDuration() * percentage);

	STREAM.setCurrentPlaybackTime(position);

	$.position.width = (percentage * 100) + "%";
};

/**
 * Handles the progress event from the audio stream
 * @param {Object} _event The stream event
 */
$.streamProgress = function(_event) {
	if(STREAM.playbackState == Ti.Media.VIDEO_PLAYBACK_STATE_PLAYING) {
		var percentage = ((STREAM.currentPlaybackTime / STREAM.getDuration()) * 100);
		var time = DATE.duration(STREAM.currentPlaybackTime);

		percentage = percentage >= 1 ? percentage : 1;

		$.position.width = percentage + "%";
		$.time.text = (time.hours() !== 0 ? time.hours() + ":" : "") + time.minutes() + ":" + (time.seconds() < 10 ? "0" : "") + time.seconds();
	}
};

/**
 * Handles the state event from the audio stream
 * @param {Object} _event The stream event
 */
$.streamState = function(_event) {
	if(_event.playbackState == Ti.Media.VIDEO_PLAYBACK_STATE_PLAYING) {
		$.play.visible = false;
		$.pause.visible = true;
	} else {
		$.pause.visible = false;
		$.play.visible = true;
	}
};

$.handlePrevious = function(_event) {
	APP.log("debug", "podcast_podcast @previous");

	if(ACTION.previous) {
		$.streamStop();

		APP.addChild("podcast_podcast", {
			id: ACTION.previous.id,
			index: CONFIG.index
		}, false, true);
	}
};

$.handleNext = function(_event) {
	APP.log("debug", "podcast_podcast @next");

	if(ACTION.next) {
		$.streamStop();

		APP.addChild("podcast_podcast", {
			id: ACTION.next.id,
			index: CONFIG.index
		}, false, true);
	}
};

// Event listeners
$.play.addEventListener("click", $.streamPlay);
$.pause.addEventListener("click", $.streamPause);
$.track.addEventListener("click", $.streamSeek);
$.previous.addEventListener("click", $.handlePrevious);
$.next.addEventListener("click", $.handleNext);

if(OS_IOS) {
	// Download is disabled for Android, we get a SIGSEGV
	$.download.addEventListener("click", $.downloadRemoteFile);
}

// Kick off the init
$.init();
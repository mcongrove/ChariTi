var APP = require("core");
var SOCIAL = require("social");
var DATE = require("alloy/moment");
var STRING = require("alloy/string");
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
	$.downloadRemoteMP3(_data.url);

	//disabled cover image because my podcast only have the same cover image for all episode
	//$.artwork.image = _data.image;
	$.date.text = DATE(parseInt(_data.date, 10)).format("MMMM Do, YYYY h:mma")
	$.title.text = _data.title;
	$.text.value = _data.description;

	ACTION.url = _data.link;

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

$.downloadRemoteMP3 = function(_url) {

	var filename = _url.substring(_url.lastIndexOf("/") + 1, _url.lastIndexOf(".mp3")) + '.mp3';

	if(Titanium.Platform.name == 'android') {
		// SD Card
		var AppDataDir = Ti.Filesystem.getFile(Ti.Filesystem.externalStorageDirectory);

	} else {
		var AppDataDir = Titanium.Filesystem.applicationDataDirectory;
	}

	var FileToPlayInternaly = Titanium.Filesystem.getFile(AppDataDir, filename);

	if(FileToPlayInternaly.exists()) {

		var MP3_path = FileToPlayInternaly.getNativePath();

	} else {

		client = Titanium.Network.createHTTPClient();

		client.onload = function(e) {

			var file = Titanium.Filesystem.getFile(AppDataDir, filename);

			file.write(this.responseData);

			Ti.API.info("Downloaded file: " + filename);

		};
		client.onerror = function(e) {
			Ti.API.debug(e.error);
		};

		client.open('GET', _url);
		client.send();
	}

};

$.createAudioPlayer = function(_url) {
	APP.log("debug", "podcast_podcast.createAudioPlayer(" + _url + ")");

	Ti.Media.audioSessionMode = Ti.Media.AUDIO_SESSION_MODE_PLAYBACK;

	var filename = _url.substring(_url.lastIndexOf("/") + 1, _url.lastIndexOf(".mp3")) + '.mp3';

	if(Titanium.Platform.name == 'android') {
		// SD Card
		var AppDataDir = Ti.Filesystem.getFile(Ti.Filesystem.externalStorageDirectory);

	} else {
		var AppDataDir = Titanium.Filesystem.applicationDataDirectory;
	}

	var FileToPlayInternaly = Titanium.Filesystem.getFile(AppDataDir, filename);

	if(FileToPlayInternaly.exists()) {

		var MP3_path = FileToPlayInternaly.getNativePath();

		Ti.API.info("Using local mp3");

	} else {

		var MP3_path = _url;
		Ti.API.info("Getting remote mp3");

	}

	STREAM = Ti.Media.createVideoPlayer({
		url: MP3_path,
		backgroundColor: "#000",
		fullscreen: false,
		allowsAirPlay: true,
		mediaControlStyle: Ti.Media.VIDEO_CONTROL_NONE,
		mediaTypes: Ti.Media.VIDEO_MEDIA_TYPE_AUDIO,
		repeatMode: Ti.Media.VIDEO_REPEAT_MODE_NONE,
		sourceType: Ti.Media.VIDEO_SOURCE_TYPE_STREAMING,
		useApplicationAudioSession: true,
		autoplay: false,
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
		},
		favorite: function(_event) {
			APP.log("debug", "podcast_podcast @favorite");

			var imageFullPath = this.image;
			var imagePath = imageFullPath.slice(0, -9); // all but star.png
			var imageFile = imageFullPath.slice(-9); // only star.png

			var isFavorite = MODEL.getPodcast(_id).favorite;

			Ti.API.info("Is Favorite on load = " + isFavorite);
			Ti.API.info("Favorite button clicked and set value = " + isFavorite);

			if(isFavorite == 1) {
				//set favorite image				
				this.image = imagePath + "star2.png";
				Ti.API.info("imagePath = " + imagePath + " imageFile = " + imageFile);
			} else {
				//unset favorite image
				this.image = imagePath + "star1.png";
				Ti.API.info("imagePath = " + imagePath + " imageFile = " + imageFile);
			}

			ACTION.setFavorite = MODEL.toggleFavorite(_id);

		},
		favIcon: function(_event) {
			var imageFullPath = this.image;
			var imagePath = imageFullPath.slice(0, -9); // all but star.png
			var imageFile = imageFullPath.slice(-9); // only star.png

			Ti.API.info("Is Favorite = " + isFavorite);

			if(isFavorite === 1) {
				//set favorite image				
				this.image = imagePath + "star2.png";
				Ti.API.info("imagePath = " + imagePath + " imageFile = " + imageFile);
			} else {
				//unset favorite image
				this.image = imagePath + "star1.png";
				Ti.API.info("imagePath = " + imagePath + " imageFile = " + imageFile);
			}

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
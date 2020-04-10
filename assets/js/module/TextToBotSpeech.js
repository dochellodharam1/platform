define(['jquery', 'botlibreSdk', 'lib/Utility'], function($, botlibreSdk, Utility) {
	
	var instance = function(settings) {
		settings = settings || {callbacks : {} };
		var dummyFn = function(param) {};
		var defaults = {
			container: '',
			applicationId: '',
			bot: { avatar: '21260897', gender: 'female', speechRate: 0.9, nativeVoiceName: 'Google UK English Female' },
			callbacks: {
				onStart: dummyFn,
				onEnd: dummyFn,
				onPause: dummyFn,
				onResume: dummyFn,
				onUtterance: dummyFn,
				onVoicesChange: dummyFn
			}
		};
		
		// Attrs
		var container = settings.container || defaults.container;
		var applicationId = settings.applicationId || defaults.applicationId;
		var bot = settings.bot || defaults.bot;
		
		// Callbacks
		var onStart = settings.callbacks.onStart || defaults.callbacks.onStart;
		var onEnd = settings.callbacks.onEnd || defaults.callbacks.onEnd;
		var onPause = settings.callbacks.onPause || defaults.callbacks.onPause;
		var onResume = settings.callbacks.onResume || defaults.callbacks.onResume;
		var onUtterance = settings.callbacks.onUtterance || defaults.callbacks.onUtterance;
		var onVoicesChange = settings.callbacks.onVoicesChange || defaults.callbacks.onVoicesChange;
		
		SDK.applicationId = applicationId;
		SDK.speechRate = bot.speechRate;
		var sdk = new SDKConnection();
		var web = new WebAvatar();
		web.connection = sdk;
		web.avatar = bot.avatar;
		web.voice = 'cmu-slt';
		web.voiceMod = 'default';
		
		// Responsive voice support
		web.nativeVoice = true;
		web.nativeVoiceName = bot.nativeVoiceName;
		
		var widthInPx = $(container).width();
		web.width = widthInPx;
		web.createBox();
		
		var removeOverlay = function() {
			var avatarBox = $("#avatar-avatarbox");
			avatarBox.find(".avatar-avatarboxmenu").remove();
			var avatarBoxDiv = avatarBox.parent();
			$(container).append(avatarBox);
			avatarBoxDiv.remove();
		};
		
		var lastSentence = null;
		var speak = function(text) {
			lastSentence = text;
			onStart();
			web.addMessage(text, "", "", "");
			web.processMessages();
			onEnd();
			track({'w': 'bot', 'i': text});
		};
		
		var repeat = function() {
			if(lastSentence) {
				speak(lastSentence);
			}
		};
		
		var resize = function(size) {
			$('#avatar-avatar-image-div, #avatar-avatar, #avatar-avatar-video-div, #avatar-avatar-video, #avatar-avatar-canvas-div, #avatar-avatar-canvas')
			.css('width', size + 'px');
			$('#avatar-avatar-canvas').attr('width', size);
			$('#avatar-avatar-canvas').attr('height', size);
		};

		speak("");
		$(document).ready(removeOverlay);
		
		return {
			getAvailableVoices: function() {},
			getCurrentVoice: bot.nativeVoiceName,
			setVoice: function(voice) {  },
			resize: resize, 
			start: speak,
			repeat: repeat,
			pause: function() { },
			resume: function() {  },
			stop: function() { }
		};
	};
	return instance;
});
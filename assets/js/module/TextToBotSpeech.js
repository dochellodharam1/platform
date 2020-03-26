define(['jquery', 'Utility', 'botlibreSdk'], function($, Utility, botlibreSdk) {
	
	var instance = function(settings) {
		settings = settings || {callbacks : {} };
		var dummyFn = function(param) {};
		var defaults = {
			container: '',
			applicationId: '',
			pitch: 1,
			rate: 1,
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
		var pitch = settings.pitch || defaults.pitch;
		var rate = settings.rate || defaults.rate;
		
		// Callbacks
		var onStart = settings.callbacks.onStart || defaults.callbacks.onStart;
		var onEnd = settings.callbacks.onEnd || defaults.callbacks.onEnd;
		var onPause = settings.callbacks.onPause || defaults.callbacks.onPause;
		var onResume = settings.callbacks.onResume || defaults.callbacks.onResume;
		var onUtterance = settings.callbacks.onUtterance || defaults.callbacks.onUtterance;
		var onVoicesChange = settings.callbacks.onVoicesChange || defaults.callbacks.onVoicesChange;
	
		var faces = [
			{ name: "Avery Business", gender: "female", avatar: "21473182", voice: "cmu-slt", voiceMod: "default" },
			{ name: "Chiyo Business", gender: "female", avatar: "25338776", voice: "cmu-slt", voiceMod: "default" },
			{ name: "Eddie Tech", gender: "male", avatar: "13974718", voice: "cmu-slt", voiceMod: "default" },
			{ name: "Annelies Business", gender: "female", avatar: "20031372", voice: "cmu-slt", voiceMod: "default" },
			{ name: "Sandy 3", gender: "female", avatar: "12601502", voice: "cmu-slt", voiceMod: "default" },
			{ name: "Eddie Business", gender: "male", avatar: "13974700", voice: "cmu-slt", voiceMod: "default" },
			{ name: "Olympia Business", gender: "female", avatar: "20595840", voice: "cmu-slt", voiceMod: "default" },
			{ name: "Andie Business", gender: "female", avatar: "21260897", voice: "cmu-slt", voiceMod: "default" },
			{ name: "Lauren Business", gender: "female", avatar: "14013806", voice: "cmu-slt", voiceMod: "default" },
			{ name: "Michael Business", gender: "male", avatar: "15017070", voice: "cmu-slt", voiceMod: "default" }
		];
		
		var face = faces[8];
		
		SDK.applicationId = applicationId;
		var sdk = new SDKConnection();
		var web = new WebAvatar();
		web.connection = sdk;
		web.avatar = face.avatar;
		web.voice = face.voice;
		web.voiceMod = face.voiceMod;
		web.width = "300";
		// web.nativeVoice = !true;
		web.createBox();
		web.addMessage("Welcome to my website", "", "", "");
		web.processMessages();
		
		$(document).ready(function(){
			var avatarBox = $("#avatar-avatarbox");
			avatarBox.find(".avatar-avatarboxmenu").remove();
			var avatarBoxDiv = avatarBox.parent();
			$(container).append(avatarBox);
			avatarBoxDiv.remove();
			
			$( "#avatar-avatar-video" ).on('loadstart', function() {
			  // console.log( $(this).attr("src") );
			});
		});
		
		return {
			getAvailableVoices: function() {  },
			getCurrentVoice: null,
			setVoice: function(voice) {  },
			start: function(txt) { web.addMessage(txt, "", "", ""); web.processMessages();},
			pause: function() { },
			resume: function() {  },
			stop: function() { }
		};
	};
	return instance;
});
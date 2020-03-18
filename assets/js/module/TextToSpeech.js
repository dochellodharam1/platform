define([], function() {
	var speechSynthesis = window.speechSynthesis;
	
	var instance = function(settings) {
		settings = settings || {callbacks : {} };
		var dummyFn = function(param) {};
		var defaults = {
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
		var pitch = settings.pitch || defaults.pitch;
		var rate = settings.rate || defaults.rate;
		
		// Callbacks
		var onStart = settings.callbacks.onStart || defaults.callbacks.onStart;
		var onEnd = settings.callbacks.onEnd || defaults.callbacks.onEnd;
		var onPause = settings.callbacks.onPause || defaults.callbacks.onPause;
		var onResume = settings.callbacks.onResume || defaults.callbacks.onResume;
		var onUtterance = settings.callbacks.onUtterance || defaults.callbacks.onUtterance;
		var onVoicesChange = settings.callbacks.onVoicesChange || defaults.callbacks.onVoicesChange;
	
		speechSynthesis.onvoiceschanged = onVoicesChange;
		
		var getDefaultVoice = function() {
			var availableVoices = speechSynthesis.getVoices();
			var nonDefault = null;
			for(var i = 0; i < availableVoices.length; i++) {
				var voice = availableVoices[i];
				if(null == nonDefault) {
					nonDefault = voice;
				}
				if(voice.default) {
					return voice;
				}
			}
			return nonDefault;
		};
		
		var onUtteranceWrapFn = function(e) {
			var txt = e.target.text;
			var startedAt = e.charIndex;
			var charLength = e.charLength;
			var endedAt = startedAt + charLength; 
			var beforeWord = txt.substring(0, startedAt);
			var word = txt.substring(startedAt, endedAt);
			var afterWord = txt.substring(endedAt);
			
			var highlightedHtml = beforeWord + "<span class='highlighted'>" + word + "</span>" + afterWord;
			var highlightedText = beforeWord + "[[" + word + "]]" + afterWord;

			onUtterance({
				highlighted: {
					html: highlightedHtml,
					text: highlightedText
				},
				text: txt,
				word: word,
				charIndex: startedAt,
				charLength: charLength
			});
		};
		var currentVoice = getDefaultVoice();
		var getUtterance = function(txt) {
			var utterance = new SpeechSynthesisUtterance(txt);
			utterance.voice = currentVoice;
			utterance.pitch = pitch;
			utterance.rate = rate;
			utterance.addEventListener('start', onStart);
			utterance.addEventListener('boundary', onUtteranceWrapFn);
			utterance.addEventListener('end', onEnd);
			return utterance;
		};
		
		return {
			getAvailableVoices: function() { return speechSynthesis.getVoices(); },
			getCurrentVoice: currentVoice,
			setVoice: function(voice) { currentVoice = voice; },
			start: function(txt) { speechSynthesis.speak(getUtterance(txt)); },
			pause: function() { if (speechSynthesis.speaking) speechSynthesis.pause(); },
			resume: function() { if (speechSynthesis.paused) speechSynthesis.resume(); },
			stop: function() { speechSynthesis.cancel(); }
		};
	};
	return instance;
});
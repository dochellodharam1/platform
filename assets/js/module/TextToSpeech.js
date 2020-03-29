define(['jquery', 'Utility', 'TemplateProvider'], function($, Utility, TemplateProvider) {
	var moduleTemplate = TemplateProvider.template(function() {/*_TEMPLATE_
		<div class="utterance-display-box">
			<p></p>
		</div>
	_TEMPLATE_*/});
	
	var speechSynthesis = window.speechSynthesis;
	
	var instance = function(settings) {
		settings = settings || {callbacks : {} };
		var dummyFn = function(param) {};
		var defaults = {
			container: '',
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
		var pitch = settings.pitch || defaults.pitch;
		var rate = settings.rate || defaults.rate;
		
		// Callbacks
		var onStart = settings.callbacks.onStart || defaults.callbacks.onStart;
		var onEnd = settings.callbacks.onEnd || defaults.callbacks.onEnd;
		var onPause = settings.callbacks.onPause || defaults.callbacks.onPause;
		var onResume = settings.callbacks.onResume || defaults.callbacks.onResume;
		var onUtterance = settings.callbacks.onUtterance || defaults.callbacks.onUtterance;
		var onVoicesChange = settings.callbacks.onVoicesChange || defaults.callbacks.onVoicesChange;
	
		$(container).append(moduleTemplate);
		
		// Module elements
		var innerCircleBox = $(".circle-animator-box .inner-circle-box");
		var outerCircleBox = $(".circle-animator-box .outer-circle-box");
		var utteranceDisplayPanel = $(".utterance-display-box p");
		
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
		var lastUtterred = '';
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
			
			utteranceDisplayPanel.html(highlightedHtml);
			
			onUtterance({
				id: Utility.hashCode(txt),
				highlighted: {
					html: highlightedHtml,
					text: highlightedText
				},
				text: txt,
				word: word,
				charIndex: startedAt,
				charLength: charLength
			});
			lastUtterred = txt;
		};
		
		var onEndWrapFn = function(e) {
			onUtterance({
				id: Utility.hashCode(lastUtterred),
				highlighted: {
					html: lastUtterred,
					text: lastUtterred
				},
				text: lastUtterred,
				word: '',
				charIndex: lastUtterred.length - 1,
				charLength: 0
			});
			onEnd(e);
		};
		
		var currentVoice = getDefaultVoice();
		var getUtterance = function(txt) {
			var utterance = new SpeechSynthesisUtterance(txt);
			utterance.voice = currentVoice;
			utterance.pitch = pitch;
			utterance.rate = rate;
			utterance.addEventListener('start', onStart);
			utterance.addEventListener('boundary', onUtteranceWrapFn);
			utterance.addEventListener('end', onEndWrapFn);
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
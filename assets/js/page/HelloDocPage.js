define(['jquery', 'lib/ConfigProvider', 'lib/TemplateProvider', 'lib/DialougeHelper', 'lib/MedicalDiagnostic', 
		'module/SpeechToText', 'module/TextToBotSpeech', 'module/ChatBox', 'module/MapSearch', 'module/ToggleableLoader'], 
	function ($, ConfigProvider, TemplateProvider, DialougeHelper, MedicalDiagnostic, 
		SpeechToText, TextToBotSpeech, ChatBox, MapSearch, ToggleableLoader) {
			
	var pageTemplate = TemplateProvider.template(function() {/*_TEMPLATE_
		<div class="map-view"></div>
		<!-- <div class="loader-view" style="height: 350px; width: 350px; margin: 0 auto;"></div> -->
		<div class="doctor-avatar" style="width: 350px; margin: 0 auto;"></div>
		<div class="chat-box"></div>
	_TEMPLATE_*/});
	
	$("#talk .row").append(pageTemplate);

	// Utilities
	var config = new ConfigProvider();
	var dialougeHelper = null;
	var chatBox = null;
	var speechToText = null;
	var textToSpeech = null;
	var mapSearch = null;
	var medicalDiagnostic = null;
	var toggleableLoader = new ToggleableLoader({
		container: '.loader-view',
		display: 'none',
		displayInner: 'block',
		displayOuter: 'none'
	});
	
	// Callbacks
	var dummyFn = function(param) {  };
	var onSpeechToTextResult = function(param) {
		chatBox.insertChat({who: "me", text: param.userSaid});
		// TODO:: REPLY
	};
	
	var onMapSearchComplete = function(param) {
		console.log('MAP SERACH COMPLETED');
		console.log(param);
	};
	
	var onMapError = function(param) {
		console.log('MAP ERROR');
		console.log(param);
	};
	
	mapSearch = new MapSearch({
		container: '.map-view',
		display: 'none',
		credentials: {
			apiKey: config.MAP.credentials.apiKey
		},
		callbacks: {
			onSearchComplete: onMapSearchComplete,
			onError: onMapError
		}
	});
	
	var onCommandMatch = function(param) {
		if(param.source == "VOICE") {
			textToSpeech.start(param.formattedReply);
		} else if(param.source == "TEXT") {
			chatBox.insertChat({who: "bot", text: param.formattedReply});
		}
		var keywords = param.keywords;
		switch (param.dialogue.action) {
			case "MAP_SEARCH":
				mapSearch.search({
					where: keywords[1] ? keywords[1] : "nearby",
					what:  keywords[0]
				});
				break;
			case "WEB_SEARCH":
				
				break;
			default:
			
		}
	};
	
	var displayTextResponse = function(param) {
		chatBox.insertChat({id: param.id, who: "bot", text: param.highlighted.html});
	};
	
	var prepareSpeechToText = function(params){
		speechToText = new SpeechToText({
			continuous: config.SPEECH_TO_TEXT.continuous,
			autoRestart: config.SPEECH_TO_TEXT.autoRestart,
			instructionsText: config.SPEECH_TO_TEXT.instructionsText,
			commands: params,
			callbacks: {
				onListenStart: function() {toggleTalkPage(true);},
				onListenEnd: function() {toggleTalkPage(false);},
				
				onError: dummyFn,	
				onCapture: onSpeechToTextResult
			}
		});
	};
	
	dialougeHelper = new DialougeHelper({
		callbacks : {
			onCommandFetch: prepareSpeechToText,
			onCommandMatch: onCommandMatch
		}
	});
	
	var onChatSend = function(param) {
		var matchedCommand = dialougeHelper.parseStaticCommand(param.text);
		onCommandMatch(matchedCommand);
	};
	
	chatBox = new ChatBox({
		container: ".chat-box",
		display: 'none',
		callbacks: {
			onChatSend: onChatSend
		}
	});
	
	var memory = {}; 
	var toggleTalkPage =  function(bool) {
		toggleableLoader.toggleInner(!bool);
		toggleableLoader.toggleOuter(bool);
		showOnlySelectedSection("#talk");
	};
	
	textToSpeech = new TextToBotSpeech({
		container: '.doctor-avatar',
		applicationId: config.TEXT_TO_SPEECH.credentials.applicationId,
		pitch: config.TEXT_TO_SPEECH.pitch,
		rate: config.TEXT_TO_SPEECH.rate,
		callbacks: {
			onStart: dummyFn,
			onEnd: dummyFn,
			onPause: dummyFn,
			onResume: dummyFn,
			onUtterance: displayTextResponse,
			onVoicesChange: dummyFn
		}
	});
	
	medicalDiagnostic = new MedicalDiagnostic({
		callbacks: {
			onExtractSymptom: function(param) {
				console.log(param);
			},
			onDiagnose: function(param){
				console.log(param);
			}
		}
	});
	
	chatBox.clearChat();

	return {};
	
});
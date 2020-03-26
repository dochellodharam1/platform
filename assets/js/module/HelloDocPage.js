define(['jquery', 'ConfigProvider', 'DeviceTypeChecker', 'DialougeHelper', 'SpeechToText', 'TextToBotSpeech', 'ChatBox', 'MapSearch'], 
	function ($, ConfigProvider, DeviceTypeChecker, DialougeHelper, SpeechToText, TextToBotSpeech, ChatBox, MapSearch) {

	// Page elements
	var talkNowRangeOuter = $(".talk-now-range-outer");
	
	// Utilities
	var config = new ConfigProvider();
	var deviceTypeChecker = new DeviceTypeChecker();
	var dialougeHelper = null;
	var chatBox = null;
	var speechToText = null;
	var textToSpeech = null;
	var mapSearch = null;
	
	// Callbacks
	var dummyFn = function(param) {  };
	var onSpeechToTextResult = function(param) {
		chatBox.insertChat({who: "me", text: param.userSaid});
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
		mapContainer: '#map',
		searchedContentContainer: '.here-map .panel ul',
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
	
	var onChatSend = function(param) {
		var matchedCommand = dialougeHelper.parseStaticCommand(param.text);
		onCommandMatch(matchedCommand);
	};
	
	dialougeHelper = new DialougeHelper({
		callbacks : {
			onCommandMatch: onCommandMatch
		}
	});
	
	chatBox = new ChatBox({
		chatContainer: "#chatbox",
		inputBox: ".mytext",
		callbacks: {
			onChatSend: onChatSend
		}
	});
	var memory = {}; 
	var toggleTalkPage =  function(bool) {
		talkNowRangeOuter.toggle(bool);
		showOnlySelectedSection("#talk");
	};
	speechToText = new SpeechToText({
		continuous: config.SPEECH_TO_TEXT.continuous,
		autoRestart: config.SPEECH_TO_TEXT.autoRestart,
		instructionsText: config.SPEECH_TO_TEXT.instructionsText,
		commands: dialougeHelper.getCommands(),
		callbacks: {
			onListenStart: function() {toggleTalkPage(true);},
			onListenEnd: function() {toggleTalkPage(false);},
			
			onError: dummyFn,	
			onCapture: onSpeechToTextResult
		}
	});
	
	textToSpeech = new TextToBotSpeech({
		container: '#doctor-avatar',
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
	
	chatBox.clearChat();

	return {};
	
});
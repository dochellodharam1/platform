define(['jquery', 'DeviceTypeChecker', 'DialougeHelper', 'SpeechToText', 'TextToSpeech', 'ChatBox', 'MapSearch'], 
	function ($, DeviceTypeChecker, DialougeHelper, SpeechToText, TextToSpeech, ChatBox, MapSearch) {

	// Page elements
	var talkNowRangeOuter = $(".talk-now-range-outer");
	var talkNowBtn = $("#talk_now_btn");
	
	// Utilities
	var deviceTypeChecker = new DeviceTypeChecker();
	var dialougeHelper = null;
	var chatBox = null;
	var speechToText = null;
	var textToSpeech = null;
	var mapSearch = null;
	
	// Callbacks
	var dummyFn = function(param) {  };
	var onSpeechToTextResult = function(param) {
		//console.log(param);
		//chatBox.insertChat({who: "me", text: param.userSaid});
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
		callbacks : {
			onMapSearchComplete : onMapSearchComplete,
			onMapError : onMapError
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
	
	speechToText = new SpeechToText({
		continuous: true,
		autoRestart: true,
		commands: dialougeHelper.getCommands(),
		callbacks: {
			onListenStart: talkNowRangeOuter.show,
			onListenEnd: talkNowRangeOuter.hide,
			
			onError: dummyFn,	
			onCapture: onSpeechToTextResult
		}
	});
	
	textToSpeech = new TextToSpeech({
		pitch: 1,
		rate: 0.9,
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
	talkNowBtn.click(function(e) {
		var _self = $(this);
		var sectionAttr = 'data-show-section';
		var sectionToDisplay = _self.attr(sectionAttr);
		var previous = showOnlySelectedSection(sectionToDisplay).previous; 
		_self.attr(sectionAttr, previous);
		speechToText.start(); 
		talkNowBtn.find('div.inner-loader').toggleClass('inner-circle-loader');
		var icon = talkNowBtn.find('i');
		icon.toggleClass('fa-microphone');
		icon.toggleClass('fa-times');
	});

	return {};
	
});
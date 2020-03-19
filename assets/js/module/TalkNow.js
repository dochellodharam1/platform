define(['jquery', 'qrCode', 'ChatBox', 'DeviceTypeChecker', 'SpeechToText', 'TextToSpeech', 'FullScreenProvider', 'MapSearch'], 
	function ($, QRCode, ChatBox, DeviceTypeChecker, SpeechToText, TextToSpeech, FullScreenProvider, MapSearch) {
	
	var body = $("body");
	var chatBox = $("#chatbox");
	var talkNowBtn = $("#talk_now_btn");
	var talkNowCancelBtn = $("#talk_now_cancel_btn");
	var mainHomeSplash = $("#main_home_splash");
	var talkNowPage = $("#talk_now_page");
	var talkNowResponse = $("#talk_now_response");
	var talkNowChatInput = $("#talk_now_chat_input");
	var voiceSelect = "#voice_select ul";
	var voiceSelectList = "#voice_select ul li";
	var voiceSelected = "#voice_select span.selected";
	var talkNowRangeOuter = $(".talk-now-range-outer");
	var qrcodeContainer = $("#qrcode_container");

	// FIXME:: remove
	window.enableConversationPannel = function() {chatBox.show();}; enableConversationPannel();

	// Callbacks
	var dummyFn = function(param) {  };
	
	var reqRes = {
		"hello doctor" : "Hello! What is your name?",
		"my name is *name": "Okay {0}, How you feeling today?",
		"(pleople)(you can) call me *name": "Okay {0}, How you feeling today?",
		"hello doctor *verb" : "Hi Neetesh!, How you feeling today?",
		"i am (not feeling well)(not feeling good)(not well)(little)(sick)(today)" : "Should I suggest some medicine or doctors nearby?",
		"i am feeling *anything": "do you want to search anything?",
		"(ok)(yeah)(yup)(please) suggest (me)(the) :what (in) *tag": "Ok finding {0} in {1}",
		"no thanks": "You are welcome",
		"thanks": "You are welcome",
		"no thank you": "You are welcome",
		"thank you": "You are welcome",
		"find :what in *where": "Okay... Searching for {0} in {1}",
		"find :what nearby": "Okay... Searching for {0} nearby your location",
		"find :what nearme": "Okay... Searching for {0} at your location"
	};

	var queryToServer = function(query) {
		// TODO :: find best result
		// TODO:: send response to user
		// onServerResponse('');
	};
	var chatBox = new ChatBox({
		chatContainer: "#chatbox",
		inputBox: ".mytext",
		callbacks: {
			onChatSend: function(param) {queryToServer(param.text);}
		}
	});
	chatBox.clearChat();

	var displayResponse = function(res) { talkNowResponse.html(res); };

	var textToSpeech = new TextToSpeech({
		pitch: 1,
		rate: 0.9,
		callbacks: {
			onStart: dummyFn,
			onEnd: function() {displayResponse("");},
			onPause: dummyFn,
			onResume: dummyFn,
			onUtterance: function(param) { displayResponse(param.highlighted.html); },
			onVoicesChange: dummyFn
		}
	});

	var onServerResponse = function(res) {
		textToSpeech.start(res);
		chatBox.insertChat({who: "bot", text: res});
	};

	var addVoicesToSelector = function(voices, selected) {
		$(voiceSelectList).remove();
		voices.forEach(function (voice, i) {
			var optionText = voice.name + " (" + voice.lang + ")"
			var li = '<li><a data-index="' + i + '">' + optionText + '</a></li>';
			if(voice == selected) {
				$(voiceSelected).text(voice.lang);
				$(voiceSelect).prepend('<li role="separator" class="divider"></li>');
				$(voiceSelect).prepend(li);
			} else {
				$(voiceSelect).append(li);
			}
		});
		$(voiceSelectList).click(onVoiceSelect);
	};

	var populateVoices = function () {
		var voices = textToSpeech.getAvailableVoices();
		var selected = null;
		voices.forEach(function (voice) {
			if (voice.default) {
				selected = voice;
			}
		});
		addVoicesToSelector(voices, selected);
	};

	var loggerFn = function(e, n) {
		//console.log("--- ID: ", n, " AT: ", new Date());
		//console.log(e);
	};

	var onSpeechToTextResult = function(param) {
		console.log(param);
		chatBox.insertChat({who: "me", text: param.userSaid});
		queryToServer(param.userSaid);
	};

	var speechToText = null;
	var onListenStart = function(e) {
		talkNowRangeOuter.show();
		loggerFn(e, "ACTUAL START");
	};
	var onListenEnd = function(e) {
		talkNowRangeOuter.hide();
		loggerFn(e, "ACTUAL END");
	};
	var pageMemory = null;
	var toggleTalkNowPage = function(bool) {
		mainHomeSplash.toggle();
		talkNowPage.toggle();
		talkNowBtn.toggle();
		chatBox.clearChat();
		populateVoices();
		body.toggleClass("no-scroll");
		if(bool)
			pageMemory = showOnlySelectedSection('#hello');
		else 
			pageMemory = showOnlySelectedSection(pageMemory.previous);
	};
	var formatResponse = function(res, args) {
		if(args) {
			for(var i = 0; i < args.length; i++) {
				var regex = new RegExp("\\{" + i + "\\}", 'g');
				res = res.replace(regex, args[i]);
			}
		}
		return res;
	};
	var mapSearch = new MapSearch();
	var getCommands = function() {
		var cmds = [];
		for(var rr in reqRes) {
			var cmd = (function(req, res){
				return {command: req,
						callback: function(...params) {
							// TODO:: add command search 
							if(req.startsWith("find :what")) {
								mapSearch.search({
									where: params[1] ? params[1] : "nearby",
									what:  params[0]
								});
							}
							onServerResponse(formatResponse(res, params));
						}
				};
			})(rr, reqRes[rr]);
			
			cmds.push(cmd);
		}
		return cmds;
	};
	speechToText = new SpeechToText({
		continuous: true,
		autoRestart: true,
		commands: getCommands(),
		callbacks: {
			onListenStart: onListenStart,
			onListenEnd: onListenEnd,
			
			onError: function(e) { loggerFn(e, "onError"); toggleTalkNowPage(false); },	
			onCapture: onSpeechToTextResult
		}
	});
	var onVoiceSelect = function(e) { 
		var selectedIndex = $(this).find("a").attr("data-index");
		console.log(selectedIndex);
		var voices = textToSpeech.getAvailableVoices();
		var selected = voices[selectedIndex];
		textToSpeech.setVoice(selected);
		addVoicesToSelector(voices, selected);
	};
	// Event handlers
	talkNowBtn.click(function(e) { toggleTalkNowPage(true); speechToText.start(); });
	talkNowCancelBtn.click(function(e) { toggleTalkNowPage(false); speechToText.stop(); });

	var fullScreenProvider = new FullScreenProvider();
	var deviceTypeChecker = new DeviceTypeChecker();

	if(deviceTypeChecker.isMobile() || deviceTypeChecker.isTablet()) {
		//body.hover(function(e) { fullScreenProvider.requestFullScreen(); });
		qrcodeContainer.hide();
	} else {
		var qrcode = new QRCode(document.getElementById("qrcode"), {
			text: window.location.href,
			logo: '',
			
			width: 250,
			height: 250,
			
			colorDark: "#000099",
			colorLight: "#ffffff",

			PI: '#ff0080',
			PO: '#9900cc', 
			
			AI: '#ff9900',
			AO: '#ff0080',
			correctLevel: QRCode.CorrectLevel.H // L, M, Q, H
		});
	}
	
	return {};
});
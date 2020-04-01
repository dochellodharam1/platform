define(['jquery', 'lib/Utility', 'lib/ConfigProvider', 'lib/TemplateProvider', 'lib/DialougeHelper', 'lib/MedicalDiagnostic', 'lib/ConversationContextHolder',
		'module/SpeechToText', 'module/TextToBotSpeech', 'module/ChatBox', 'module/MapSearch', 'module/ToggleableLoader'], 
	function ($, Utility, ConfigProvider, TemplateProvider, DialougeHelper, MedicalDiagnostic, ConversationContextHolder,
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
	var contextHolder = new ConversationContextHolder();
	var dialougeHelper = null;
	var chatBox = null;
	var speechToText = null;
	var textToSpeech = null;
	var mapSearch = null;
	var medicalDiagnostic = new MedicalDiagnostic();
	var toggleableLoader = new ToggleableLoader({
		container: '.loader-view',
		display: 'none',
		displayInner: 'block',
		displayOuter: 'none'
	});
	
	// Callbacks
	var dummyFn = function(param) {  };
	
	mapSearch = new MapSearch({
		container: '.map-view',
		display: 'none',
		credentials: {
			apiKey: config.MAP.credentials.apiKey
		}
	});
	
	var preAction = function(param){
		if (param.formattedReply) {
			textToSpeech.start(param.formattedReply);
		}
		switch (param.whenToAct) {
			case 'NEVER':
				// Absolutely no action
				break;
			case 'AT_ONCE':
				performAction(param);
				break;
			case 'AFTER_NEXT_INPUT':
				contextHolder.add(param);
				break;
		}
	};
	
	var performAction = function(param) {
		var onModuleResult = function(displayEvent, result) {
			var count = result.count;
			var replyAfterAction = param.replyAfterAction;
			if(replyAfterAction) {
				var arrgs = [...keywords, count];
				var reply = dialougeHelper.prepareReply(replyAfterAction, arrgs);
				postAction({
					'displayEvent' : displayEvent,
					'reply': reply,
					'items': result.items
				});
			}
		};
		
		var keywords = param.keywords;
		switch (param.action) {
			case 'NO_ACTION':
				// Absolutely no action
				break;
			case 'MAP_SEARCH':
				if(!keywords.length) return;
				mapSearch.search(
					{ where: keywords[1] ? keywords[1] : 'nearby',  what:  keywords[0] }, 
					function(result) {onModuleResult('SHOW_MAP_DATA', result);}, 
					function(error){/* TODO:: */}
				);
				break;
			case 'WEB_SEARCH':
				
				break;
			case 'DRUG_SEARCH':
				
				break;
			case 'SYMPTOM_CHECK':
				if (param.metadata && param.metadata.request) {
					var m = param.metadata;
					var getChoices = function(item) { return Utility.collect(item.choices, function(c) { return c.label; }) };
					if(m.waitingFor) {
						debugger;
						var answerToPreviousQuestion = Utility.findBestMatchedString(param.userInput, getChoices(m.waitingFor));
						var choice = Utility.findFirst(m.waitingFor.choices, function(c) {return c.label == answerToPreviousQuestion;});
						if(choice) {
							m.request.evidence.push({
								"id": m.waitingFor.id,
								 "choice_id": choice.id
							});
						}
					}
					medicalDiagnostic.diagnose(m.request,
						function(result) { 
							var conditions = result.response.conditions;
							var req = result.request;
							var res = result.response;
							var question = res.question;
							var item = question.items[0];
							var q = question.text;
							switch(question.type) {
								case 'group_single':
									q += '. Is it ' + item.name; 
									break;
								case 'group_multiple':
									q = q.replace(' below', ' like ') + item.name;
									break;
								case 'group_single':
									break;
							}
							q += '. Say ' + Utility.join(getChoices(item), ' or ');
							debugger;
							preAction({
								'metadata': { 'request' : req, 'conditions': res.conditions, 'waitingFor': item },
								'userInput': null,
								'whenToAct': 'AFTER_NEXT_INPUT',
								'formattedReply': q,
								'action': 'SYMPTOM_CHECK',
								'keywords': [],
								'replyAfterAction': null
							});
							
							onModuleResult('SHOW_SYMPTOMS_DATA', result); 
						},
						function(error){
							console.log(error);
						});
				} else {
					medicalDiagnostic.extractSymptoms(param.userInput, [], 
						function(result){ 
							var req = { 
								"sex": "male",
								"age": 30,
								"evidence": []
							};
							var mentions = result.response.mentions;
							for (var i = 0; i < mentions.length; i++) {
								var mention = mentions[i];
								if(mention.type == 'symptom') {
									req.evidence.push({
										"id": mention.id,
										"choice_id": mention.choice_id,
										"initial": "true"
									});
								} else {
									 // TODO::  extract care
								}
							}
							preAction({
								'metadata': {'request' : req},
								'userInput': null,
								'whenToAct': 'AT_ONCE',
								'formattedReply': null,
								'action': 'SYMPTOM_CHECK',
								'keywords': [],
								'replyAfterAction': ''
							});
						},
						function(error){
							console.log(error);
						});
				}
				break;
			case 'REPEAT_PREVIOUS_REPLY':
				
				break;
			case 'DO_LAST_ACTION':
				
				break;
			default:
			
		}
	};
		
	var postAction = function(param) {
		switch(param.displayEvent) {
			case 'SHOW_MAP_DATA':
				
				break;
			case 'SHOW_SYMPTOMS_DATA':
				
				break;
		}
		textToSpeech.start(param.reply);
	};
	
	var onUserInput = function(param) {
		var lastContext = contextHolder.lastContext();
		switch(param.source) {
			case 'RAW_VOICE_INPUT':
				chatBox.insertChat({who: 'me', text: param.userSaid});
				debugger;
				preAction({
					'metadata': lastContext ? lastContext.metadata : null,
					'userInput': param.userSaid,
					'whenToAct': 'AT_ONCE',
					'formattedReply': null,
					'action': lastContext ? lastContext.action : 'NO_ACTION',
					'keywords': lastContext ? lastContext.keywords : [],
					'replyAfterAction': lastContext ? lastContext.replyAfterAction : null
				});
				break;
			case 'RAW_TEXT_INPUT': // Input already in chat box
				debugger;
				preAction({
					'metadata': lastContext ? lastContext.metadata : null,
					'userInput': param.text,
					'whenToAct': 'AT_ONCE',
					'formattedReply': null,
					'action': lastContext ? lastContext.action : 'NO_ACTION',
					'keywords': lastContext ? lastContext.keywords : [],
					'replyAfterAction': lastContext ? lastContext.replyAfterAction : null
				});
				break;
			case 'VOICE_REGISTERED_COMMAND': // Handlled in next case VOICE_REGISTERED_COMMAND_PROCESSED
				debugger;
				var pendingAction = lastContext ? lastContext.action : 'NO_ACTION';
				var isToPerformLastAction = param.dialogue.action == 'DO_LAST_ACTION';
				var actionToBeperformed = isToPerformLastAction ? pendingAction : param.dialogue.action;
				preAction({
					'metadata': lastContext ? lastContext.metadata : null,
					'userInput': param.pureIntent,
					'whenToAct': param.dialogue.whenToAct,
					'formattedReply': param.formattedReply,
					'action': actionToBeperformed,
					'keywords': param.keywords,
					'replyAfterAction': param.dialogue.replyAfterAction
				});
				break;
			case 'VOICE_REGISTERED_COMMAND_PROCESSED':
				chatBox.insertChat({who: 'me', text: param.userSaid});
				break;
			default:
		}
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
				onCapture: onUserInput
			}
		});
		textToSpeech = new TextToBotSpeech({
			container: '.doctor-avatar',
			applicationId: config.TEXT_TO_SPEECH.credentials.applicationId,
			pitch: config.TEXT_TO_SPEECH.pitch,
			rate: config.TEXT_TO_SPEECH.rate,
			callbacks: {
				onStart: speechToText.pause,
				onEnd: speechToText.resume,
				onPause: dummyFn,
				onResume: dummyFn,
				onUtterance: function(param) {
					chatBox.insertChat({id: param.id, who: 'bot', text: param.highlighted.html});
				},
				onVoicesChange: dummyFn
			}
		});
	};
	
	dialougeHelper = new DialougeHelper({
		callbacks : {
			onCommandFetch: prepareSpeechToText,
			onCommandMatch: onUserInput
		}
	});
	
	chatBox = new ChatBox({
		container: '.chat-box',
		display: 'none',
		callbacks: {
			onChatSend: function(param) {
				onUserInput({
					text: param.text,
					source: 'RAW_TEXT_INPUT'
				});
			}
		}
	});
	
	var memory = {}; 
	var toggleTalkPage =  function(bool) {
		toggleableLoader.toggleInner(!bool);
		toggleableLoader.toggleOuter(bool);
		showOnlySelectedSection('#talk');
	};
	
	chatBox.clearChat();

	return {};
	
});
define(['annyang', 'annyangUI', 'lib/TemplateProvider'], function(annyang, annyangUI, TemplateProvider) {
	var sayTextTemplate = TemplateProvider.template(function(){/* _TEMPLATE_[ ${text} ] _TEMPLATE_*/});
	var instance = function(settings) {
		settings = settings || {callbacks : {} };
		var dummyFn = function(param) {};
		var dummyVarargsFn = function(...param) {};
		var defaults = {
			continuous: true,
			autoRestart: true,
			instructions: ['Hello doc!'],
			commands: [
				// annyang will capture anything after a splat (*) and pass it to the function.
				// e.g. saying "Show me Batman and Robin" is the same as calling showFlickr('Batman and Robin');
				{ command: 'show me *tag', callback: function(a) {console.log("Show me :: ", a);}},

				// A named variable is a one word variable, that can fit anywhere in your command.
				// e.g. saying "calculate October stats" will call calculateStats('October');
				{ command: 'calculate :month stats', callback: function(a) {console.log("calculate :: ", a);}},

				// By defining a part of the following command as optional, annyang will respond to both:
				// "say hello to my little friend" as well as "say hello friend"
				{ command: 'say hello (to my little)(mister)(miss) friend', callback: function(a) {console.log("say hello :: ", a);} } 
			],
			callbacks: {
				onListenStart: dummyFn,
				onListenEnd: dummyFn,
				
				onCapture: dummyFn,
				onError: dummyFn
			}
		};
		
		var continuous = settings.continuous || defaults.continuous;
		var autoRestart = settings.autoRestart || defaults.autoRestart;
		var instructions = settings.instructions || defaults.instructions;
		
		var commands = settings.commands || defaults.commands;		
		
		// Callbacks
		var onListenStart = settings.callbacks.onListenStart || defaults.callbacks.onListenStart;		
		var onListenEnd = settings.callbacks.onListenEnd || defaults.callbacks.onListenEnd;	
		
		var onCapture = settings.callbacks.onCapture || defaults.callbacks.onCapture;
		var onError = settings.callbacks.onError || defaults.callbacks.onError;
		
		var keywordsHolder = {};
		var addCommands = function(commands) {
			var commandsFormat = {};
			for(var i = 0; i < commands.length; i++) {
				var cmd = commands[i];
				var key = null;
				var callback = null;
				if (typeof cmd == "object") {
					key = cmd.command;
					callback = cmd.callback;
				} else if(typeof cmd == "string") {
					key = cmd;
				}
				if (typeof callback != 'function') {
					callback = dummyVarargsFn;
				}
				var closure = (function(k, cl) {
					return function(...args) { 
						keywordsHolder[k] = args;
						cl(...args);
					};
				})(key, callback);
				commandsFormat[key] = closure;
			}
			annyang.addCommands(commandsFormat);
		};
		addCommands(commands);
				
		annyang.addCallback("soundstart", onListenStart);
		annyang.addCallback("end", onListenEnd);
		
		annyang.addCallback('error', function(e) {onError('error');});
		annyang.addCallback('errorNetwork', function(e) {onError('errorNetwork');});
		
		annyang.addCallback('errorPermissionBlocked', function(e) {onError('errorPermissionBlocked');});
		annyang.addCallback('errorPermissionDenied', function(e) {onError('errorPermissionDenied');});

		annyang.addCallback("resultMatch", function(userSaid, commandText, phrases) {
			onCapture({
				userSaid: userSaid,
				commandText: commandText,
				keywords: keywordsHolder[commandText],
				source: 'VOICE_REGISTERED_COMMAND_PROCESSED'
			});
		});
		annyang.addCallback("resultNoMatch", function(e) {
			var possibleSentence = e[0];
			onCapture({
				userSaid: possibleSentence,
				commandText: null,
				keywords: possibleSentence,
				source: 'RAW_VOICE_INPUT'
			});
		});
		// Tell KITT to use annyang
		SpeechKITT.annyang();
		SpeechKITT.setStartCommand(function() {
			onListenStart();
			annyang.start();
		});
		SpeechKITT.setAbortCommand(function () {
			onListenEnd();
			annyang.abort();
		});	

		
		// Define a stylesheet for KITT to use
		SpeechKITT.setStylesheet('assets/css/speechkitt.min.css');


		
		var start = function() {
			annyang.start({
				continuous: continuous,
				autoRestart: autoRestart
			});
		};
		
		var setInstructionsFn = function(arr) {
			var html = 'Say: ';
			for (var i = 0; i < arr.length; i++) {
				html += TemplateProvider.parse(sayTextTemplate, {'text': arr[i]});
			}
			SpeechKITT.setInstructionsText(html);
		};
		setInstructionsFn(instructions);
		
		// Render KITT's interface
		SpeechKITT.vroom();
		return {
			addCommands: addCommands,
			start: start,
			pause: annyang.pause,
			resume: annyang.resume,
			abort: annyang.abort,
			setInstructions: setInstructionsFn
		};
	};
	return instance;
});
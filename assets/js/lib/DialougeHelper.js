define(['jquery', 'lib/ConfigProvider', 'lib/TemplateProvider'], function ($, ConfigProvider, TemplateProvider) {
	var config = new ConfigProvider();
	var dialogues = [];
	var size = 100;
	
	
	var instance = function(settings) {
		settings = settings || {callbacks : {} };
		var dummyFn = function(param) {};
		
		var defaults = {
			callbacks: {
				onCommandFetch: dummyFn,
				onCommandMatch: dummyFn
			}
		};
		
		var onCommandFetch = settings.callbacks.onCommandFetch || defaults.callbacks.onCommandFetch;
		var onCommandMatch = settings.callbacks.onCommandMatch || defaults.callbacks.onCommandMatch;
		
		var formatReply = function(rep, args) {
			if(args) {
				for(var i = 0; i < args.length; i++) {
					var regex = new RegExp("\\{" + i + "\\}", 'g');
					rep = rep.replace(regex, args[i]);
				}
			}
			return rep;
		};		
					
		var prepareCommand = function(dialogue) {
			return {
				command: dialogue.intent, 
				callback: function(...params) {
					onCommandMatch({
						dialogue: dialogue,
						formattedReply: formatReply(dialogue.reply, params),
						keywords: params,
						source: 'VOICE'
					});
				}
			};
		};
		
		var getCommands = function() {
			var cmds = [];
			dialogues.forEach(function(dialogue) {
				cmds.push(prepareCommand(dialogue));
			});
			return cmds;
		};
		
		var parseStaticCommand = function(staticCommand) {
			// TODO:: parse command coming from chat box
			var dialogue = {
				"intent": "find :what in *where",
				"reply": "Okay... Searching for {0} in {1}",
				"action": "MAP_SEARCH",
				"type": "NON_CONTEXTUAL"
			};
			var keywords = [];
			return {
				dialogue : dialogue,
				formattedReply: formatReply(dialogue.reply, keywords),
				keywords : keywords,
				source: 'TEXT'
			};
		};
		
		var loadDialogues = function(page) {
			$.get(config.CONVERSATION_API.url, {'page': page, 'size': size}).then(function(res) {
				var content = res.content;
				dialogues = [...dialogues, ...content];
				if (!res.last) {
					loadDialogues(++page);
				} else {
					onCommandFetch(getCommands());
				}
			});
		};
		loadDialogues(0);
		
		return {
			getCommands: getCommands,
			parseStaticCommand: parseStaticCommand 
		};
	};
	return instance;
	
});
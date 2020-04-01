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
		
		var prepareReplyFn = function(replyTemplate, params) {
			return formatReply(replyTemplate, params);
		};
		
		var getPureIntent = function(intent) {
			return intent.replace(/ *\([^)]*\) */g, "");
		};
		
		var getUserSaid = function(intent, params) {
			var pureIntent = getPureIntent(intent);
			if (params.length) {
				if(pureIntent.indexOf('*') != -1) {
					pureIntent = pureIntent.split('*')[0] + params[params.length - 1];
				}
				if(pureIntent.indexOf(':') != -1) {
					var tokens = pureIntent.split(' ');
					var j = 0;
					var userSaid = '';
					for(var i = 0; i < tokens.length; i++) {
						var token = tokens[i];
						if(token.indexOf(':') != -1) {
							userSaid += ' ' + params[j++];
						} else {
							userSaid += ' ' + token;
						}
					}
					pureIntent = userSaid;
				}
			}
			return pureIntent;
		};
					
		var prepareCommand = function(dialogue) {
			return {
				command: dialogue.intent, 
				callback: function(...params) {
					onCommandMatch({
						dialogue: dialogue,
						pureIntent: getPureIntent(dialogue.intent),
						userSaid: getUserSaid(dialogue.intent, params),
						formattedReply: formatReply(dialogue.reply, params),
						keywords: params,
						source: 'VOICE_REGISTERED_COMMAND'
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
			prepareReply: prepareReplyFn
		};
	};
	return instance;
	
});
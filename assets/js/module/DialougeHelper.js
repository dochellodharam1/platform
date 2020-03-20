define(['jquery'], function ($) {

	var dialogues = [
		{
			"intent": "hello doctor",
			"reply": "Hello! What is your name?",
			"action": "MAP_SEARCH",
			"type": "NON_CONTEXTUAL"
		},
		{
			"intent": "my name is *name",
			"reply": "Okay {0}, How you feeling today?",
			"action": "MAP_SEARCH",
			"type": "NON_CONTEXTUAL"
		},
		{
			"intent": "(pleople)(you can) call me *name",
			"reply": "Okay {0}, How you feeling today?",
			"action": "MAP_SEARCH",
			"type": "NON_CONTEXTUAL"
		},
		{
			"intent": "hello doctor *verb",
			"reply": "Hi Neetesh!, How you feeling today?",
			"action": "MAP_SEARCH",
			"type": "NON_CONTEXTUAL"
		},
		{
			"intent": "i am (not feeling well)(not feeling good)(not well)(little)(sick)(today)",
			"reply": "Should I suggest some medicine or doctors nearby?",
			"action": "MAP_SEARCH",
			"type": "NON_CONTEXTUAL"
		},
		{
			"intent": "i am feeling *anything",
			"reply": "do you want to search anything?",
			"action": "MAP_SEARCH",
			"type": "NON_CONTEXTUAL"
		},
		{
			"intent": "(ok)(yeah)(yup)(please) suggest (me)(the) :what (in) *tag",
			"reply": "Ok finding {0} in {1}",
			"action": "MAP_SEARCH",
			"type": "NON_CONTEXTUAL"
		},
		{
			"intent": "no thanks",
			"reply": "You are welcome",
			"action": "MAP_SEARCH",
			"type": "NON_CONTEXTUAL"
		},
		{
			"intent": "thanks",
			"reply": "You are welcome",
			"action": "MAP_SEARCH",
			"type": "NON_CONTEXTUAL"
		},
		{
			"intent": "no thank you",
			"reply": "You are welcome",
			"action": "MAP_SEARCH",
			"type": "NON_CONTEXTUAL"
		},
		{
			"intent": "thank you",
			"reply": "You are welcome",
			"action": "MAP_SEARCH",
			"type": "NON_CONTEXTUAL"
		},
		{
			"intent": "find :what in *where",
			"reply": "Okay... Searching for {0} in {1}",
			"action": "MAP_SEARCH",
			"type": "NON_CONTEXTUAL"
		},
		{
			"intent": "suggest :what in *where",
			"reply": "Okay... Searching for {0} in {1}",
			"action": "MAP_SEARCH",
			"type": "NON_CONTEXTUAL"
		},
		{
			"intent": "search :what in *where",
			"reply": "Okay... Searching for {0} in {1}",
			"action": "MAP_SEARCH",
			"type": "NON_CONTEXTUAL"
		},
		{
			"intent": "display :what in *where",
			"reply": "Okay... Searching for {0} in {1}",
			"action": "MAP_SEARCH",
			"type": "NON_CONTEXTUAL"
		},
		{
			"intent": "find :what (nearme)(near me)(nearby)(near by)",
			"reply": "Okay... Searching for {0} at your location",
			"action": "MAP_SEARCH",
			"type": "NON_CONTEXTUAL"
		},
		{
			"intent": "suggest :what (nearme)(near me)(nearby)(near by)",
			"reply": "Okay... Searching for {0} at your location",
			"action": "MAP_SEARCH",
			"type": "NON_CONTEXTUAL"
		},
		{
			"intent": "search :what (nearme)(near me)(nearby)(near by)",
			"reply": "Okay... Searching for {0} at your location",
			"action": "MAP_SEARCH",
			"type": "NON_CONTEXTUAL"
		},
		{
			"intent": "display :what (nearme)(near me)(nearby)(near by)",
			"reply": "Okay... Searching for {0} at your location",
			"action": "MAP_SEARCH",
			"type": "NON_CONTEXTUAL"
		}
	];
	
	
	
	var instance = function(settings) {
		settings = settings || {callbacks : {} };
		var dummyFn = function(param) {};
		
		var defaults = {
			callbacks: {
				onCommandMatch: dummyFn
			}
		};
		
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
		
		return {
			getCommands: getCommands,
			parseStaticCommand: parseStaticCommand 
		};
	};
	return instance;
	
});
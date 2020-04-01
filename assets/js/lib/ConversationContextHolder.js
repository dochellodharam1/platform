define([], function() {
	var conversations = [];
	var lastConversation = null;
	
	var instance = function() {
		var addFn = function(c) {
			conversations.unshift(c);
			lastConversation = c;
		};
		var lastFn = function(){
			return lastConversation;
		};
		return {
			add: addFn,
			lastContext: lastFn
		};
	};
	
	return instance;
});
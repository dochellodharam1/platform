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
		var clearFn = function() {
			conversations = [];
			lastConversation = null;
		};
		return {
			add: addFn,
			clear: clearFn,
			lastContext: lastFn
		};
	};
	
	return instance;
});
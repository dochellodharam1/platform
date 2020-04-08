define(['jquery', 'lib/Utility', 'lib/ConfigProvider'], function($, Utility, ConfigProvider) {
	var config = new ConfigProvider();
	var sessionId = Utility.generateGuid();
	var uId = Utility.generateGuid();
	var trackFn = function(metadata) {
		var userId = uId;
		Utility.enableToString(metadata);
		var data = {"u": userId, "s": sessionId, "m": metadata.toString()};
		$.get(config.TRACKER.url, data)
		.then(function(){});
	};
	window.track = trackFn;
	return {
		track: trackFn
	};
});
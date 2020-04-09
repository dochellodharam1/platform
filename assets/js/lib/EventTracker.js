define(['jquery', 'lib/Utility', 'lib/ConfigProvider'], function($, Utility, ConfigProvider) {
	var config = new ConfigProvider();
	var sessionId = Utility.generateGuid();
	var userId = Utility.generateGuid();
	var makeCall = function(url, data) {
		$.ajax({
			'url': url,
			'method': 'GET',
			'data': data,
			'success': function(result, textStatus, jqXHR) {},
			'error': function (jqXHR, textStatus, errorThrown) {}
		});
	};
	var trackFn = function(metadata) {
		Utility.enableToString(metadata);
		var data = {"u": userId, "s": sessionId, "m": metadata.toString()};
		makeCall(config.TRACKER.url, data);
	};
	window.track = trackFn;
	
	
	setInterval(function() {
		makeCall(config.HEARTBEAT.url, {"u": userId, "s": sessionId});
	}, config.HEARTBEAT.intervalMS);
	
	return {
		track: trackFn
	};
});
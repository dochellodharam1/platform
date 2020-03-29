define(['jquery', 'ConfigProvider'], function($, ConfigProvider) {
	var config = new ConfigProvider();
	var trackFn = function(userId, metadata) {
		var data = encodeURI(metadata);
		$.get(config.TRACKER.url, {"userId": userId, "metadata": data})
		.then(function(){
			console.log("done");
		});
	};
	window.track = trackFn;
	return {
		track: trackFn
	};
});
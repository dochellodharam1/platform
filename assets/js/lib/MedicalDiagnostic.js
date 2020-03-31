define(['lib/ConfigProvider'], function(ConfigProvider) {
	var config = new ConfigProvider().DIAGNOSTIC_API;
	
	var apiUrl = config.url;
	var apiHeader = {
		'App-Id': config.credentials.applicationId,
		'App-Key': config.credentials.applicationKey
	};
	var instance = function(settings) {
		settings = settings || {callbacks : {} };
		var dummyFn = function(param) {};
		
		var defaults = {
			callbacks: {
				onExtractSymptom: dummyFn,
				onDiagnose: dummyFn
			}
		};
		
		// Callbacks
		var onExtractSymptom = settings.callbacks.onExtractSymptom || defaults.callbacks.onExtractSymptom;
		var onDiagnose = settings.callbacks.onDiagnose || defaults.callbacks.onDiagnose;
		
		var callApi = function(uri, data, onResult) {
			$.ajax({
				url: apiUrl + uri,
				method: 'POST',
				headers: apiHeader,
				contentType: 'application/json',
				data : data
			}).then(function(result) {
				onResult({
					request: data,
					response: result
				});
			});
		};
		
		var extractSymptomsFn = function(text, otherSymptoms) {
			var data = { 'text' : text };
			if(otherSymptoms) {
				var arr = [];
				for (var i = 0; i < otherSymptoms.length; i++) {
					arr.push(otherSymptoms[i].id);
				}
				data['context'] = arr;
			}
			callApi('/parse', data, onExtractSymptom);
		};
		
		var diagnoseFn = function(request) {
			callApi('/diagnosis', request, onDiagnose);
		};
		
		return {
			extractSymptoms: extractSymptomsFn,
			diagnose: diagnoseFn
		};
	};
	
	return instance;
});

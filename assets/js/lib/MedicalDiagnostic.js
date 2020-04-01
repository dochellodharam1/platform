define(['lib/ConfigProvider'], function(ConfigProvider) {
	var config = new ConfigProvider().DIAGNOSTIC_API;
	
	var apiUrl = config.url;
	var apiHeader = {
		'App-Id': config.credentials.applicationId,
		'App-Key': config.credentials.applicationKey
	};
	var instance = function() {		
		var callApi = function(uri, json, onResult, onError) {
			$.ajax({
				url: apiUrl + uri,
				method: 'POST',
				headers: apiHeader,
				contentType: 'application/json',
				data : JSON.stringify(json),
				success: function(result, textStatus, jqXHR) {
					onResult({
						request: json,
						response: result
					});
				},
				error: function (jqXHR, textStatus, errorThrown) {
					onError({
						'jqXHR': jqXHR,
						'textStatus': textStatus,
						'errorThrown': errorThrown
					});
				}
			});
		};
		
		var extractSymptomsFn = function(text, otherSymptoms, onExtractSymptoms, onError) {
			var data = { "text" : text };
			if(otherSymptoms) {
				var arr = [];
				for (var i = 0; i < otherSymptoms.length; i++) {
					arr.push(otherSymptoms[i].id);
				}
				data['context'] = arr;
			}
			callApi('/parse', data, onExtractSymptoms, onError);
		};
		
		var diagnoseFn = function(request, onDiagnose, onError) {
			callApi('/diagnosis', request, onDiagnose, onError);
		};
		
		return {
			extractSymptoms: extractSymptomsFn,
			diagnose: diagnoseFn
		};
	};
	
	return instance;
});

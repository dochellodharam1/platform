define(['jquery'], function($) {
	
	var instance = function() {
		return {
			MAP: {
				credentials: {
					apiKey: 'pA97nRDfxh7nTK0Tt6niCcmv-kM1xtt550Wrui55cB4'
				}
			},
			SPEECH_TO_TEXT: {
				continuous: true,
				autoRestart: true,
				instructionsText: 'Say! Hello Doc'
			},
			TEXT_TO_SPEECH: {
				pitch: 1,
				rate: 0.9,
				credentials: {
					applicationId: '6291889508634688769'
				}
			},
			NEWS_API: {
				sources: ['bbc-news'],
				credentials: {
					apiKey: '9360456286c2406eb3bb1cdda170d743'
				}
			},
			TRACKER: {
				url: ''
			}
		};
	};
	
	return instance;
});
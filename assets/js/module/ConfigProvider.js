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
				rate: 0.9
			}
		};
	};
	
	return instance;
});
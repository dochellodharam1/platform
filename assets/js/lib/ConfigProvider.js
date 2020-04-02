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
				bots: [
						{
							avatar: '13974718',
							gender: 'male',
							speechRate: 0.9,
							nativeVoiceName: 'Google UK English Male'
						},
						{
							avatar: '21260897',
							gender: 'female',
							speechRate: 0.9,
							nativeVoiceName: 'Google UK English Female'
						}
				][0],
				credentials: {
					applicationId: '6291889508634688769'
				}
			},
			NOTIFICATION_API: {
				url: 'https://phoenix-notification-api.herokuapp.com/notifications',
				attribution: '<strong>Powered By: </strong><a class="noti-powered-by" target="_new" href="https://newsapi.org">News API</a>'
			},
			CONVERSATION_API: {
				url: 'https://phoenix-conversation-api.herokuapp.com/data'
			},
			MEDICINE_API: {
				url: '',
				credentials: {
					applicationId: ''
				}
			},
			DIAGNOSTIC_API:{
				url: 'https://api.infermedica.com/v2',
				credentials: {
					applicationId: 'b301453a',
					applicationKey: 'bf2f2efd3ba21591dfd8c2b2dcd8cb53'
				}
			},
			TRACKER: {
				url: 'https://phoenix-event-tracker.herokuapp.com/events'
			}
		};
	};
	
	return instance;
});
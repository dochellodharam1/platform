define(['jquery'], function($) {
	
	var instance = function() {
		return {
			SEARCH_DATA: {
				doctors: [
					'Doctor', 'Allergist', 'Anesthesiologist', 'Cardiologist', 'Colon and Rectal Surgeons',
					'Critical Care Medicine Specialists', 'Dermatologist', 'Emergency Medicine Specialists',
					'Emergency Physician', 'Endocrinologist', 'Family Physicians', 'Gastroenterologist',
					'General Practitioner', 'General Surgeons', 'Geriatric Medicine Specialists',
					'Hematologists', 'Hospice and Palliative Medicine Specialists', 'Immunologist',
					'Infectious Disease Specialists', 'Internists', 'Medical Geneticists',
					'Nephrologist', 'Neurologist', 'Obstetrician', 'Gynecologist', 'Oncologist', 
					'Ophthalmologist', 'Orthopedist', 'Osteopaths', 'Otolaryngologist', 'Pathologist',
					'Pediatrician', 'Physiatrist', 'Plastic Surgeon', 'Podiatrist', 
					'Preventive Medicine Specialist', 'Psychiatrist', 'Pulmonologist', 'Radiologist',
					'Rheumatologist', 'Sleep Medicine Specialist', 'Sports Medicine Specialist',
					'Surgeon', 'Urologist'
				],
				places: [
					'Medicine store', 'Drug store'
				]
			},
			MAP: {
				credentials: {
					apiKey: 'pA97nRDfxh7nTK0Tt6niCcmv-kM1xtt550Wrui55cB4'
				}
			},
			SPEECH_TO_TEXT: {
				continuous: true,
				autoRestart: true,
				cancelSpeakerVoiceWhenMatchPer: 25, 
				instructions: ['Hello Doc']
			},
			TEXT_TO_SPEECH: {
				bot: [
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
				][1],
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
				url: 'https://phoenix-notification-api.herokuapp.com/medical-drugs',
				credentials: {
					applicationId: ''
				}
			},
			DIAGNOSTIC_API:{
				url: 'https://api.infermedica.com/v2',
				minSymtomsToAsk: 5,
				showResultCommand: 'show results',
				credentials: {
					applicationId: 'b301453a',
					applicationKey: 'bf2f2efd3ba21591dfd8c2b2dcd8cb53'
				}
			},
			TRACKER: {
				url: 'https://phoenix-event-tracker.herokuapp.com/events'
			},
			HEARTBEAT: {
				url: 'https://phoenix-event-tracker.herokuapp.com/heart-beat',
				intervalMS: 15000
			}
		};
	};
	
	return instance;
});
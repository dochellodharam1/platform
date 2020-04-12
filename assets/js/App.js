requirejs.config({
    baseUrl: './assets/js',
    paths: {
		jquery: 'vendor/jquery-1.11.2.min',
		wayPoint: 'vendor/waypoints.min',
		qrCode: 'vendor/easy.qrcode',
		annyang: 'vendor/annyang.min',
		annyangUI: 'vendor/speechkitt.min',
		botlibreSdk: 'vendor/botlibre_sdk',
		timeAgo: 'vendor/timeago.full.min',
		textSimilarity: 'vendor/string-similarity.min'
    }
});
requirejs([
	'jquery', 
	'lib/Theme',
	'lib/EventTracker',
	'page/HomePage',
	'page/HelloDocPage',
	'page/SearchPage',
	'page/Covid19Page'
]);
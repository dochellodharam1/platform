requirejs.config({
    baseUrl: './assets/js',
    paths: {
		lib: './lib',
		pages: './pages',
		jquery: './vendor/jquery-1.11.2.min',
		wayPoint: './vendor/waypoints.min',
		qrCode: './vendor/easy.qrcode',
		annyang: './vendor/annyang.min',
		annyangUI: './vendor/speechkitt.min',
		botlibreSdk: './vendor/botlibre_sdk',
		timeAgo: './vendor/timeago.full.min'
    }
});
requirejs([
	'jquery', 
	'lib/Theme',
	'lib/EventTracker',
	'pages/HomePage',
	'pages/HelloDocPage'
]);
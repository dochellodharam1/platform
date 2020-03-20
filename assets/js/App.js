requirejs.config({
    baseUrl: './assets/js/module',
    paths: {
		jquery: '../vendor/jquery-1.11.2.min',
		wayPoint: '../vendor/waypoints.min',
		qrCode: '../vendor/easy.qrcode',
		annyang: '../vendor/annyang.min',
		annyangUI: '../vendor/speechkitt.min'
    }
});
requirejs([
	'jquery', 
	'Theme',
	'HomePage',
	'HelloDocPage'
]);
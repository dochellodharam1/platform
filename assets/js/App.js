requirejs.config({
    baseUrl: './assets/js/module',
    paths: {
		jquery: '../vendor/jquery-1.11.2.min',
		wayPoint: '../vendor/waypoints.min',
		qrCode: '../vendor/easy.qrcode',
		annyang: '../vendor/annyang.min',
		mapCore: '../vendor/map/here/mapsjs-core',
		mapService: '../vendor/map/here/mapsjs-service',
		mapUI: '../vendor/map/here/mapsjs-ui',
		mapEvents: '../vendor/map/here/mapsjs-mapevents'
    }
});
requirejs([
	'jquery', 
	'ThemePage',
	'TalkNow',
	'MapSearch'
]);
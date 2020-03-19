define(['jquery'], function($) {
	var instance = function() {
		var init = function() {
			/**
			 * Moves the map to display over Berlin
			 *
			 * @param  {H.Map} map      A HERE Map instance within the application
			 */
			function moveMapToBerlin(map){
			  map.setCenter({lat:52.5159, lng:13.3777});
			  map.setZoom(14);
			}

			/**
			 * Boilerplate map initialization code starts below:
			 */

			//Step 1: initialize communication with the platform
			// In your own code, replace variable window.apikey with your own apikey
			var platform = new H.service.Platform({
			  apikey: 'pA97nRDfxh7nTK0Tt6niCcmv-kM1xtt550Wrui55cB4'
			});
			var defaultLayers = platform.createDefaultLayers();

			//Step 2: initialize a map - this map is centered over Europe
			var map = new H.Map(document.getElementById('map'),
			  defaultLayers.vector.normal.map,{
			  center: {lat:50, lng:5},
			  zoom: 4,
			  pixelRatio: window.devicePixelRatio || 1
			});
			// add a resize listener to make sure that the map occupies the whole container
			window.addEventListener('resize', () => map.getViewPort().resize());

			//Step 3: make the map interactive
			// MapEvents enables the event system
			// Behavior implements default interactions for pan/zoom (also on mobile touch environments)
			var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

			// Create the default UI components
			var ui = H.ui.UI.createDefault(map, defaultLayers);

			// Now use the map as required...
			window.onload = function () {
			  moveMapToBerlin(map);
			}    
		};
		init();
		var searchByLatLong = function(query) {
			// TODO:: 
			console.log(query);
		};
		var searchWrap = function(json) {
			if( ["nearby", "near by", "nearme", "near me"].indexOf(json.where) > -1) {
				if (navigator.geolocation) {
					navigator.geolocation.getCurrentPosition(function(loc) {
						searchByLatLong({
							what: json.what,
							position : loc.coords.latitude + "," + loc.coords.longitude
						});
					});
				}
			} else {
				var url = "https://geocoder.ls.hereapi.com/6.2/geocode.json";
				var apiKey = "pA97nRDfxh7nTK0Tt6niCcmv-kM1xtt550Wrui55cB4";
				$.get(url, { searchtext: json.where, apiKey: apiKey, gen : 9 })
				.done(function( data ) {
					var loc = data.Response.View[0].Result[0].Location.NavigationPosition[0];
					searchByLatLong({
						what: json.what,
						position : loc.Latitude + "," + loc.Longitude
					});
				});
			}
		};
		var toggleDisplay = function(bool) {
			
		};
		return {
			search: searchWrap,
			toggleDisplay: toggleDisplay 
		};
	};
	return instance;
	  
});
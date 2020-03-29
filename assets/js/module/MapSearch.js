define(['jquery', 'TemplateProvider'], function($, TemplateProvider) {
	var moduleTemplate = TemplateProvider.template(function() {/*_TEMPLATE_
		<div class="here-map" style="display: ${display}">
			<div id="map" ></div>
			<div class="panel panel-side" >
				<ul></ul>
			</div>
			<div class="panel panel-bottom">
				<div class="arrow arrowL"></div>
				<div class="content"><ul></ul></div>
				<div class="arrow arrowR"></div>
			</div>
			<div id="clear" ></div>
		</div>
	_TEMPLATE_*/});
	
	var placeItemTemplate = TemplateProvider.template(function() {/*_TEMPLATE_
		<li class="place" data-pos-lat="${lat}" data-pos-lng="${lng}">
			<div class="wrap">
				<div class="meta">
					<p class="name">${place.title}</p>
					<p class="cat">${place.category.title}</p>
					<p class="vicinity">${place.vicinity}(${place.distance})</p>
				</div>
			</div>
		</li>
	_TEMPLATE_*/});
	
	var markerContentTemplate = TemplateProvider.template(function() {/*_TEMPLATE_
		<div style="font-size: 10px" >
			<h3>${title}</h3>
			<h4>${category.title}</h4>
			${vicinity}
		</div>
	_TEMPLATE_*/});
	
	var instance = function(settings) {
		settings = settings || {callbacks : {} };
		var dummyFn = function(param) {};
		
		var defaults = {
			container: '',
			display: 'block',
			credentials: {
				apiKey: 'FsjN5-JHlUTgC6Tb6M5bP8PH3hTLFR_dchOLAexbKA4'
			},
			callbacks: {
				onSearchComplete: dummyFn,
				onError: dummyFn
			}
		};

		var container = settings.container || defaults.container;
		var display = settings.display || defaults.display;
		var apiKey = settings.credentials.apiKey || defaults.credentials.apiKey;
		
		var onSearchComplete = settings.callbacks.onSearchComplete || defaults.callbacks.onSearchComplete;
		var onError = settings.callbacks.onError || defaults.callbacks.onError;
		
		var searchedContentContainer = '.here-map .panel ul';
		$(container).append(TemplateProvider.parse(moduleTemplate, {'display': display}));
		
		// Here API
		var platform = new H.service.Platform({ apikey: apiKey });
		
		var defaultLayers = platform.createDefaultLayers();
		
		var map = new H.Map(
			$('#map')[0],
			defaultLayers.vector.normal.map,
			{ center: { lat: 50, lng: 5 },
				zoom: 4,
				pixelRatio: window.devicePixelRatio || 1
			}
		);
		
		var ui = H.ui.UI.createDefault(map, defaultLayers);
		
		var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
		
		var searchByLatLong = function (query) {
			//var position = { lat : 28.502388, lng : 77.044708};
			moveMapToCoordinates(query.position);
			populatePlaces(query);
		};
		
		var bubble;
		var openBubble = function (position, text) {
			if(!bubble){
				bubble =  new H.ui.InfoBubble( position, {content: text} ); // The FO property holds the province name.
				ui.addBubble(bubble);
			} else {
				bubble.setPosition(position);
				bubble.setContent(text);
				bubble.open();
			}
		};
		
		var group = new H.map.Group();
		// add 'tap' event listener, that opens info bubble, to the group
		group.addEventListener('tap', function (evt) {
			map.setCenter(evt.target.getGeometry(), true);
			openBubble(evt.target.getGeometry(), evt.target.content);
		}, false);
		
		var addPlacesToMap = function (places) {
			group.addObjects(places.map(function (place) {
				var marker = new H.map.Marker({lat: place.position[0], lng: place.position[1]});
				marker.content = TemplateProvider.parse(markerContentTemplate, place);
				return marker;
			}));

			map.addObject(group);

			// get geo bounding box for the group and set it to the map
			//map.setViewBounds(group.getBounds());
		};
		
		var moveMapToCoordinates = function(position){
			map.setCenter({lat:position.lat, lng:position.lng}, true);
			map.setZoom(13);
		};
		
		var onResult = function (result) {
			var places = result.results.items;
			addPlacesToMap(places);
			addPlacesToPanel(places);
		};
		
		var populatePlaces = function(query) {
			var loc = query.position;
			var placesService = platform.getPlacesService();
			var parameters = {
				at: loc.lat+ ','+ loc.lng,
				q: query.what
			};
			placesService.search(parameters, onResult, onError);
		};
		
		var placesContainer = document.getElementById('panel');
		var addPlacesToPanel = function (places) {
			for (i = 0;  i < places.length; i += 1) {
				var place = places[i];
				var lat = place.position[0];
				var lng = place.position[1];
				var item = TemplateProvider.parse(placeItemTemplate, {
					'lat': lat, 
					'lng': lng,
					'place': place
				});
				$(searchedContentContainer).append(item);
			}
		};
		window.addEventListener('resize', function() { map.getViewPort().resize(); });
		
		var searchWrap = function(json) {
			if( ["nearby", "near by", "nearme", "near me"].indexOf(json.where) > -1) {
				if (navigator.geolocation) {
					navigator.geolocation.getCurrentPosition(function(loc) {
						searchByLatLong({
							what: json.what,
							position : {
								lat : loc.coords.latitude,
								lng : loc.coords.longitude
							}
						});
					});
				}
			} else {
				var url = "https://geocoder.ls.hereapi.com/6.2/geocode.json";
				$.get(url, { searchtext: json.where, apiKey: apiKey, gen : 9 })
				.done(function( data ) {
					var loc = data.Response.View[0].Result[0].Location.NavigationPosition[0];
					searchByLatLong({
						what: json.what,
						position : {
							lat : loc.Latitude,
						    lng : loc.Longitude
						}
					});
				});
			}
		};
		
		$(document).on("click",'.here-map .panel-bottom .arrowR', function(){
			$('.here-map .panel-bottom ul').animate({'left':'-=300px'});
		});

		$(document).on("click",'.here-map .panel-bottom .arrowL', function(){
			$('.here-map .panel-bottom ul').animate({'left':'+=300px'});
		});
		
		$(document).on("click", ".here-map ul li.place", function(){
			var lat = $(this).attr('data-pos-lat');
			var lng = $(this).attr('data-pos-lng');
			moveMapToCoordinates({lat: lat, lng: lng});
		});
		
		var toggle = function(bool) {
			var div = $(container + ' .here-map');
			if(bool == 'undefined') {
				return div.toggle();
			}
			return div.toggle(bool);
		};
		
		return {
			search: searchWrap,
			show: function() { toggle(true);},
			hide: function() { toggle(false);},
			toggle: toggle
		};
	};
	return instance;
	  
});
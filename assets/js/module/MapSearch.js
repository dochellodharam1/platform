define(['jquery'], function($) {
	var instance = function(settings) {
		settings = settings || {callbacks : {} };
		var onMapError = settings.callbacks.onMapError;
		var init = (function() {
			/**
			 * Moves the map to display over Berlin
			 *
			 * @param  {H.Map} map      A HERE Map instance within the application
			 */
			function moveMapToCoordinates(map, position){
				map.setCenter({lat:position.lat, lng:position.lng});
				//map.setCenter({lat:37.7942, lng:-122.4070});
				map.setZoom(13);
			}
			
			function populatePlaces(platform, query) {
			  var loc = query.position;
			  var placesService= platform.getPlacesService(),
				parameters = {
				  at: loc.lat+ ','+ loc.lng,//'37.7942,-122.4070',
				  q: query.what
				};

			  placesService.search(parameters,
				onResult, onError);
			}

			/**
			 * Boilerplate map initialization code starts below:
			 */
			var bubble;
			var platform = new H.service.Platform({
				'apikey': 'FsjN5-JHlUTgC6Tb6M5bP8PH3hTLFR_dchOLAexbKA4'
			 
			});
			var defaultLayers = platform.createDefaultLayers();
			console.log('Move map initialize');
			
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
			
			var placesContainer = document.getElementById('panel');
			var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
			// Create the default UI components
			var ui = H.ui.UI.createDefault(map, defaultLayers);

			// Now use the map as required...
			window.onload = function() {
				 //console.log(37.7942);//28.502388,77.044708
				 var positions = { lat : 28.502388, lng : 77.044708};
				 var query = {
					 what : 'doctor',
					 position : positions
				 };
				moveMapToCoordinates(map,query.position);
				
				populatePlaces(platform,query)
			}
			var searchByLoc = function (query) {
			   console.log(query.position.lat,query.position.lng);
			   
				//var position = { lat : 28.502388, lng : 77.044708};
				moveMapToCoordinates(map,query.position);
				
				populatePlaces(platform,query)
			 
			}   
			function openBubble(position, text){
			  if(!bubble){
				bubble =  new H.ui.InfoBubble(
				  position,
				  // The FO property holds the province name.
				  {content: text});
				ui.addBubble(bubble);
			  } else {
				bubble.setPosition(position);
				bubble.setContent(text);
				bubble.open();
			  }
			}
			function addPlacesToMap(places) {
			  var group = new  H.map.Group();
			  // add 'tap' event listener, that opens info bubble, to the group
			  group.addEventListener('tap', function (evt) {
				map.setCenter(evt.target.getPosition());
				openBubble(
				  evt.target.getPosition(), evt.target.content);
			  }, false);

			  group.addObjects(places.map(function (place) {
				var marker = new H.map.Marker({lat: place.position[0], lng: place.position[1]})
				marker.content = '<div style="font-size: 10px" ><h3>' + place.title +
				  '</h3><h4>' + place.category.title + '</h4>' + place.vicinity + '</div>';
				return marker;
			  }));

			  map.addObject(group);

			  // get geo bounding box for the group and set it to the map
			  //map.setViewBounds(group.getBounds());
			}
			
			function onError(data) {
			  error = data;
			  onMapError(error);
			}
			function onResult(result) {
			  var places = result.results.items;
			  addPlacesToMap(places);
			  addPlacesToPanel(places);
			}
			
			function addPlacesToPanel(places){

			  var nodeOL = document.createElement('ul'),
				i;

			  nodeOL.style.fontSize = 'small';
			  nodeOL.style.marginLeft ='5%';
			  nodeOL.style.marginRight ='5%';


			   for (i = 0;  i < places.length; i += 1) {
				 var li = document.createElement('li'),
					divLabel = document.createElement('div'),
					content =  '<strong style="font-size: large;">' + places[i].title  + '</strong>';
					content += '&nbsp;<span style="font-size:smaller">(' +  places[i].category.title + ')</span></br>';
					content +=  places[i].vicinity + '</br>';
					content += '<strong>distance:</strong>' +  places[i].distance + 'm</br>';

				  divLabel.innerHTML = content;
				  li.appendChild(divLabel);
				  nodeOL.appendChild(li);
			  }

			  placesContainer.appendChild(nodeOL);
			}

			return {
				searchLatLng : searchByLoc
			}
		});
		var mapApi =init();
       
		var searchByLatLong = function(query) {
			mapApi.searchLatLng(query);
			
		};
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
				var apiKey = "pA97nRDfxh7nTK0Tt6niCcmv-kM1xtt550Wrui55cB4";
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
		
		var toggleDisplay = function(bool) {
			
		};
		return {
			search: searchWrap,
			toggleDisplay: toggleDisplay 
		};
	};
	return instance;
	  
});
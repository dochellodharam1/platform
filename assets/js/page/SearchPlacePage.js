define(['jquery', 'lib/Utility', 'lib/ConfigProvider', 'lib/TemplateProvider','jqueryUi', 'module/MapSearch','module/PlacesView'], 
	function ($, Utility, ConfigProvider, TemplateProvider, jqueryUi, MapSearch, PlacesView) {
	var pageTemplate = TemplateProvider.template(function() {/*_TEMPLATE_
		<div class="main_subscribe text-center">
			<style>
				.spinner-custom {
				  border: 16px solid #f3f3f3;
				  border-radius: 50%;
				  border-top: 16px solid #3498db;
				  width: 120px;
				  height: 120px;
				  -webkit-animation: spin 2s linear infinite;
				  animation: spin 2s linear infinite;
				  margin: 100px auto;
				  display: none;
				}
				@-webkit-keyframes spin {
				  0% { -webkit-transform: rotate(0deg); }
				  100% { -webkit-transform: rotate(360deg); }
				}

				@keyframes spin {
				  0% { transform: rotate(0deg); }
				  100% { transform: rotate(360deg); }
				}
				</style>
			<div class="col-sm-10 col-sm-offset-1">
				<div class="subscribe_btns m-bottom-100">
					<div class="form-group" style="margin: auto; text-align: left; width: 320px;">
						<input type="text" class="form-control input" placeholder="Pediatrician" />
						<div class="page-view map-view"></div>
						<div class="spinner-custom"></div>
						<div class="page-view place-view" style="margin: 10px auto;"></div>
					</div>
				</div>
			</div>
		</div>
	_TEMPLATE_*/});
	
	$("#findPlace .row").append(pageTemplate);
	var config = new ConfigProvider();
	var mapSearch = new MapSearch({
		container: '.map-view',
		display: 'none',
		credentials: {
			apiKey: config.MAP.credentials.apiKey
		}
	});
	
	var spinner = $('.spinner-custom');
	var placesView = new PlacesView({ 
		container: '.place-view',
		containersToHide: '',
		callbacks: {
			onShowResult: function(){spinner.hide()}
		}
	});
	
	var searchData = config.SEARCH_DATA;
	var input = $('#findPlace input');
	input.autocomplete({
		source : [...searchData.doctors, ...searchData.places],
		minLength : 1,
		select :function( event, ui ) {
			event.preventDefault();
			var selected = ui.item.value;
			input.val(selected);
			placesView.hide();
			spinner.show();
			mapSearch.search(
				{ where: 'nearby',  what:  selected}, 
				function(result) {
					placesView.show({ 'text': '', 'items': result.items });
				}, 
				function(error){/* TODO:: */}
			);
		}
	});
	Utility.fitOnWindowResize({
		staticContainers : ['nav', 'footer'], 
		itemToFit: '#findPlace', 
		includeTopHeightFor: 'nav',
		includeBottomHeightFor: null,
		topToBottomRatio: 0.15
	}); 
	return {};
});
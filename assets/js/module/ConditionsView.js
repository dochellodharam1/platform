define(['jquery', 'lib/TemplateProvider', 'lib/Utility'], function($, TemplateProvider, Utility) {
	
	var moduleTemplate = TemplateProvider.template(function() {/*_TEMPLATE_
		<style>
			.conditions .list-group {
				height: 297px;
				overflow: auto;
				width: 320px;
				border-radius: 10px;
			}
			.conditions .list-group-item{
				height: 100px;
				overflow: hidden;
			}
			.conditions .list-group-item:hover {
				z-index: 2;
				color: #fff;
				background-color: #CCCCCC;
				border-color: #888888;
			}
			.conditions .list-group-item h4 {
				font-size: 20px;
				line-height: 1.2;
			}
			.conditions .card-details {
				width: calc(100% - 40px);				
			}
			.conditions .card-details a{
				color: #555555;
			}
			.conditions .alert {
				font-family: monospace;    
				line-height: 0;
				width: 170px;
			}
		</style>
		<div class="conditions">
			<div class="list-group">
				
			</div>
		</div>
	_TEMPLATE_*/});
	
	var conditionItemTemplate = TemplateProvider.template(function() {/*_TEMPLATE_
		<div class="card list-group-item clearfix">
			<div class="pull-left card-details">
				<a>
					<h4 class="list-group-item-heading">${title}</h4>
					<div class="alert alert-warning" role="alert">Chances: ${percentage}</div>
				</a>
			</div>
		</div>
	_TEMPLATE_*/});
	
	var instance = function(settings) {
		settings = settings || {callbacks: {}};
		var dummyFn = function(param){};
		
		var defaults = {
			container: '',
			containersToHide: '',
			callbacks: {
				onShowResult: dummyFn
			}
		};

		var container = settings.container || defaults.container;
		var containersToHide = settings.containersToHide || defaults.containersToHide;
		var onShowResult = settings.callbacks.onShowResult || defaults.callbacks.onShowResult;
		
		$(container).append(moduleTemplate);
		
		var compareFn = function(prop, a, b){
			var aProp = a[prop];
			var bProp = b[prop];
			var result = 0;
			if(typeof aProp == "number"){
				if(aProp == bProp) {
					result = 0;
				} else if(aProp > bProp) {
					result = 1;
				} else if(aProp < bProp) {
					result = -1;
				}
			} else if(typeof aProp == "string") {
				result = Utility.compareStr(aProp, bProp);
			}
			return result;
		};
		
		var populateConditions = function(obj) {
			$('.conditions .list-group').empty();
			var items = Utility.sort(obj.items, function(a, b){return compareFn('probability', a, b);});
			var text = obj.text;
			for(var i = 0; i < items.length; i++) {
				var item = items[i];
				var per = Utility.probablityToPercentage(item.probability, 2) + '%';
				var conditionItem = TemplateProvider.parse(conditionItemTemplate, { 
					title: item.common_name,
					percentage: per
				});
				$(container + ' .conditions .list-group').append(conditionItem);
			}
			onShowResult();
		};
		
		var toggle = function(bool) {
			var div = $(container);
			if(bool == 'undefined') {
				div.toggle();
			}
			div.toggle(bool);
			var newState = div.is(':visible');
			if(newState) {
				$(containersToHide).hide();
				div.show();
			}
			return newState;
		};
		
		return {
			show: function(obj) { populateConditions(obj); toggle(true);},
			hide: function() { toggle(false);},
			toggle: toggle
		};
	};
	return instance;
	  
});
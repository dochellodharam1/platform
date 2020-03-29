define(['jquery', 'lib/Utility', 'lib/TemplateProvider'], function($, Utility, TemplateProvider) {
	var moduleTemplate = TemplateProvider.template(function() {/*_TEMPLATE_
		<div class="circle-animator-box" style="display: ${display};">
			<div class="inner-circle-loader" style="display: ${displayInner};"></div>
			<div class="outer-circle-loader" style="display: ${displayOuter}; animation-delay: -3s"></div>
			<div class="outer-circle-loader" style="display: ${displayOuter}; animation-delay: -2s"></div>
			<div class="outer-circle-loader" style="display: ${displayOuter}; animation-delay: -1s"></div>
			<div class="outer-circle-loader" style="display: ${displayOuter}; animation-delay: 0s"></div>
		</div>
	_TEMPLATE_*/});
	
	var instance = function(settings) {
		settings = settings || {};
		var defaults = {
			container: '',
			display: 'block',
			displayInner: 'block',
			displayOuter: 'block'
		};
		var container = settings.container || defaults.container;
		var display = settings.display || defaults.display;
		var displayInner = settings.displayInner || defaults.displayInner;
		var displayOuter = settings.displayOuter || defaults.displayOuter;
		
		var module = TemplateProvider.parse(moduleTemplate, {
			'display': display,
			'displayInner': displayInner,
			'displayOuter': displayOuter
		});
		$(container).append(module);
		
		var toggle = function(c, bool) {
			var div = $(container + ' ' + c);
			if(bool == 'undefined') {
				return div.toggle();
			}
			return div.toggle(bool);
		};
		
		return {
			showInner: function() { toggle('.inner-circle-loader', true);},
			hideInner: function() { toggle('.inner-circle-loader', false);},
			toggleInner: function(bool) { toggle('.inner-circle-loader', bool);},
			
			showOuter: function() { toggle('.outer-circle-loader', true);},
			hideOuter: function() { toggle('.outer-circle-loader', false);},
			toggleOuter: function(bool) { toggle('.outer-circle-loader', bool);},
			
			show: function() { toggle('.circle-animator-box', true);},
			hide: function() { toggle('.circle-animator-box', false);},
			toggle: function(bool) { toggle('.circle-animator-box', bool);}
		};
	};
	
	return instance;
});

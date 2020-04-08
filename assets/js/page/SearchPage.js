define(['jquery', 'lib/Utility', 'lib/ConfigProvider', 'lib/TemplateProvider'], 
	function ($, Utility, ConfigProvider, TemplateProvider) {
	
	Utility.fitOnWindowResize({
		staticContainers : ['nav', 'footer'], 
		itemToFit: '#find', 
		includeTopHeightFor: 'nav',
		includeBottomHeightFor: null,
		topToBottomRatio: 0.15
	}); 
	return {};
	
});
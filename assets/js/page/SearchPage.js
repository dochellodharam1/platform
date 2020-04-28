define(['jquery', 'lib/Utility', 'lib/ConfigProvider', 'lib/TemplateProvider','jqueryUi'], 
	function ($, Utility, ConfigProvider, TemplateProvider) {
			
		$('#medicineFindText').autocomplete({
			source : function (req, response) {
				var drugName = req.term;
				var getUrl = `https://phoenix-notification-api.herokuapp.com/medical-drugs/${drugName}?resultCount=10`;
				$.getJSON(getUrl,function(data,textStatus,jqXHR){
					if (textStatus == 'success') {
						
						var resultObj = [];
						$.each(data.medicines, function(idx, value) {
							resultObj.push({'id':value.product_code, 'label' :value.display_name, 'value':value.display_name});
						});
						console.log(resultObj);
						response(resultObj);
					}
				});
			},
			minLength : 2
		});
		
		$('#anchorList ul li a').click(function(e) {
			e.preventDefault();
			var id = $(this).attr('id');  
		});  
	Utility.fitOnWindowResize({
		staticContainers : ['nav', 'footer'], 
		itemToFit: '#find', 
		includeTopHeightFor: 'nav',
		includeBottomHeightFor: null,
		topToBottomRatio: 0.15
	}); 
	return {
		
	};
	
});
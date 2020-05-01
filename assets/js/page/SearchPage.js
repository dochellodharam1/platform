define(['jquery', 'lib/Utility', 'lib/ConfigProvider', 'lib/TemplateProvider','jqueryUi'], 
	function ($, Utility, ConfigProvider, TemplateProvider) {
	var url = new ConfigProvider().MEDICINE_API.url;
	var medicineTemplate = TemplateProvider.template(function() {/*_TEMPLATE_
		<div class="left-column"><img data-image="black" src="https://www.netmeds.com/${image_url}" alt=""></div>
											
		<div class="right-column">
			<div class="product-description">
			  
			  <h4>${display_name}</h4>
			  <p>${pack_label}</p>
			  <span id="Manufacturer"><b>Manufacturer: </b>${manufacturer_name}</span></br>
			  <span id="Generic"><b>Generic: </b>${generic}</span>
			</div>
		</div>
	_TEMPLATE_*/});
		var medicinesData = [];
		$('#medicineFindText').autocomplete({
			source : function (req, response) {
				var drugName = req.term;
				var getUrl = `${url}/${drugName}?resultCount=10`;
				$.getJSON(getUrl,function(data,textStatus,jqXHR){
					if (textStatus == 'success') {
						medicinesData = data.medicines;
						var resultObj = [];
						$.each(data.medicines, function(idx, value) {
							resultObj.push({'id':idx, 'label' :value.display_name, 'value':value.display_name});
						});
						//console.log(resultObj);
						response(resultObj);
					}
				});
			},
			minLength : 2,
			select :function( event, ui ) {
				event.preventDefault();
				var data = medicinesData[ui.item.id];
				$("#medicineDetails").html(TemplateProvider.parse(medicineTemplate, data));
			}
		});
		
		$('#anchorList ul li a').click(function(e) {
			e.preventDefault();
			var id = $(this).attr('id');
			$("#medicineDetails").html('');
			$("#medicineFindText").text('');
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
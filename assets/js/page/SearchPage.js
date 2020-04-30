define(['jquery', 'lib/Utility', 'lib/ConfigProvider', 'lib/TemplateProvider','jqueryUi'], 
	function ($, Utility, ConfigProvider, TemplateProvider) {
		var medicineTemplate = TemplateProvider.template(function() {/*_TEMPLATE_
		<div class="left-column"><img data-image="black" src="./image-temp.jpg" alt=""></div>
											
		<div class="right-column">
			<div class="product-description">
			  
			  <h4>%medicine_name%</h4>
			  <p>%pack_label%</p>
			  <span id="Manufacturer"><b>Manufacturer: </b>%manufacturer_name%</span></br>
			  <span id="Generic"><b>Generic: </b>%generic%</span>
			</div>
		</div>
	_TEMPLATE_*/});
		var medicinesData = [];
		var renderMedicineDetails = function(data) {
			medicineTemplate = medicineTemplate.replace('%medicine_name%',data.display_name)
							.replace('%pack_label%',data.pack_label)
							.replace('%manufacturer_name%', data.manufacturer_name)
							.replace('%generic%', data.generic)
			$("#medicineDetails").html(medicineTemplate);
		}
		$('#medicineFindText').autocomplete({
			source : function (req, response) {
				var drugName = req.term;
				var getUrl = `https://phoenix-notification-api.herokuapp.com/medical-drugs/${drugName}?resultCount=10`;
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
				renderMedicineDetails(medicinesData[ui.item.id]);
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
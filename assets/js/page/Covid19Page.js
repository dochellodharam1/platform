define(['jquery', 'lib/Utility', 'lib/TemplateProvider'], function($, Utility, TemplateProvider) {
	var pageTemplate = TemplateProvider.template(function() {/*_TEMPLATE_
		<style>
			#covid19 .row {
				margin-right: -5px;
				margin-left: -5px;
			}
			.tracker iframe {
				width: 100%; 
				height: 433px; 
				border: 0px none; 
				margin-top: -4px;
			}
		</style>
		<div class="tracker" style="margin-top: 55px">
			<ul class="nav nav-tabs" style="margin-top: 75px; margin-left: 6%;">
				<li class="active"><a href="#confirmed">Confirmed</a></li>
				<li class=""><a href="#deaths">Deaths</a></li>
			  </ul>
			<iframe id="confirmed" src="https://ourworldindata.org/grapher/total-cases-covid-19?country=IND&tab=map&year=59"></iframe>
				
			<iframe id="deaths" src="https://ourworldindata.org/grapher/total-deaths-covid-19?country=IND" style="display: none"></iframe>
		</div>
	_TEMPLATE_*/});

	$("#covid19 .row").append(pageTemplate);
	
	Utility.onWindowResize(function(size){
		var navHeight = $('nav').height() + $('.tracker ul').height();
		var footerHeight = $('footer').height();
		var remainingHeight = size.height - (navHeight + footerHeight);
		$('#confirmed, #deaths').attr('height', remainingHeight);
	});
	
	$(".tracker ul li a").click(function(){
		var controledArea = $(this).attr('href');
		$('iframe').hide();
		$('.tracker ul li').removeClass('active');
		$(controledArea).show();
		$(this).parent().addClass('active');
	});
	
	return {};
});

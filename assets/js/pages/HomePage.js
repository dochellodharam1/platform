define(['jquery', 'ConfigProvider', 'qrCode', 'DeviceTypeChecker', 'TemplateProvider', 'NotificationProvider'], 
	function ($, ConfigProvider, QRCode, DeviceTypeChecker, TemplateProvider, NotificationProvider) {
	var pageTemplate = TemplateProvider.template(function() {/*_TEMPLATE_
		<div class="main_home">
			<div class="home_text">
				<div class="title-text-floated">
					<h1 class="text-white ld_fancy_heading">
						<span class="ld-fh-txt">${title}</span>
					</h1>
				</div>
				<div id="qrcode_container">
					<div class="qrcode" style="width:250px; height:250px;"></div>
					<hr />
					<p>Scan and open in Mobile!</p>
				</div>
			</div>
		</div>
	_TEMPLATE_*/});
	
	var page = TemplateProvider.parse(pageTemplate, {title: 'WE’RE <br />The Phoenix  - Gurgaon'})
	
	$("#hello .row").append(page);

	var dummyFn = function(param) {};
	
	var config = new ConfigProvider();
	
	var deviceTypeChecker = new DeviceTypeChecker();

	if(deviceTypeChecker.isMobile() || deviceTypeChecker.isTablet()) {
		//body.hover(function(e) { fullScreenProvider.requestFullScreen(); });
		$("#qrcode_container").hide();
	} else {
		var qrcode = new QRCode(document.getElementsByClassName("qrcode")[0], {
			text: window.location.href,
			logo: '',
			
			width: 250,
			height: 250,
			
			colorDark: "#000099",
			colorLight: "#ffffff",

			PI: '#ff0080',
			PO: '#9900cc', 
			
			AI: '#ff9900',
			AO: '#ff0080',
			correctLevel: QRCode.CorrectLevel.H // L, M, Q, H
		});
	}
	
	var notificationProvider = new NotificationProvider({
		apiKey: config.NEWS_API.credentials.apiKey,
		container: "#notifications-dropdown",
		sources: config.NEWS_API.sources,
		callbacks: {
			onNotificationClick: dummyFn
		}
	});
	
	return {};
	
});
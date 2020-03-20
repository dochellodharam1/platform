define(['jquery', 'qrCode', 'DeviceTypeChecker'], 
	function ($, QRCode, DeviceTypeChecker) {

	var deviceTypeChecker = new DeviceTypeChecker();

	if(deviceTypeChecker.isMobile() || deviceTypeChecker.isTablet()) {
		//body.hover(function(e) { fullScreenProvider.requestFullScreen(); });
		$("#qrcode_container").hide();
	} else {
		var qrcode = new QRCode(document.getElementById("qrcode"), {
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
	
	return {};
	
});
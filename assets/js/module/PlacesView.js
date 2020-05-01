define(['jquery', 'lib/TemplateProvider', 'lib/Utility'], function($, TemplateProvider, Utility) {
	
	var moduleTemplate = TemplateProvider.template(function() {/*_TEMPLATE_
		<style>
			.places .list-group {
				height: 357px;
				overflow: auto;
				width: 320px;
				border-radius: 10px;
			}
			.places .list-group-item{
				height: 120px;
				overflow: hidden;
			}
			.places .list-group-item:hover {
				z-index: 2;
				color: #fff;
				background-color: #CCCCCC;
				border-color: #888888;
			}
			.places .list-group-item h4 {
				font-size: 20px;
				line-height: 1.2;
			}
			.places .open {
				color: #32CD32;
				font-weight: bold;
			}
			.places .closed {
				color: #DC143C;
				font-weight: bold;
			}
			.places .card-details {
				width: calc(100% - 40px);				
			}
			.places .card-details a{
				color: #555555;
			}
			.places .card-controls {
				width: 40px;
				margin: -11px -16px;
			}
			.places .card-control {
				width: 100%;
				height: 40px;
				display: block;
				background: #EEEEEE;
				text-align: center;
				font-size: 30px;
				border: 1px solid #EEEEEE;
			}
			.places .card-control:hover {
				border: 1px solid #AEAEAE;
			}
			.places .disabled-link {
				color: currentColor;
				cursor: not-allowed;
				opacity: 0.3;
				text-decoration: none;
			}
		</style>
		<div class="places">
			<div class="list-group">
			
			</div>
		</div>
	_TEMPLATE_*/});
	
	var placeItemTemplate = TemplateProvider.template(function() {/*_TEMPLATE_
		<div class="card list-group-item clearfix">
			<div class="pull-left card-details">
				<a data-pos-lat="${position.lat}" data-pos-lng="${position.lng}" target="_new" href="${gotoUrl}">
					<h4 class="list-group-item-heading">${place.title}</h4>
					<p class="list-group-item-text">${addressLine1}</p>
					<p class="list-group-item-text">${addressLine2}</p>
					<p class="list-group-item-text">${contact}</p>
					${availability}
				</a>
			</div>
			${controls}
		</div>
	_TEMPLATE_*/});
	
	var controlsTemplate = TemplateProvider.template(function() {/*_TEMPLATE_
		<div class="pull-right card-controls">
			<a class="card-control ${open.cssClass}" href="${open.href}" target="_new">
				<i class="fa fa-external-link-square fancy-txt" aria-hidden="true"></i>
			</a>
			<a class="card-control ${share.cssClass}" href="${share.href}" data-action="${share.dataAction}" target="_new">
				<i class="fa fa-share-alt fancy-txt" aria-hidden="true"></i>
			</a>
			<a class="card-control ${phone.cssClass}" href="${phone.href}" target="_new">
				<i class="fa fa-phone fancy-txt" aria-hidden="true"></i>
			</a>
		</div>
	_TEMPLATE_*/});
	
	var availibilityTemplate = TemplateProvider.template(function() {/*_TEMPLATE_
		 <p class="list-group-item-text"><span class="${openClosedClass}">${openClosed}</span> - ${openingHours}</p>
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
		
		var addPlaces = function(obj) {
			$('.places .list-group').empty();
			var items = obj.items;
			var text = obj.text;
			for(var i = 0; i < items.length; i++) {
				var item = items[i];
				var avail = ' ';
				if(item.openingHours){
					avail = TemplateProvider.parse(availibilityTemplate, {
						openClosedClass: item.openingHours.isOpen ? 'open' : 'closed',
						openClosed: item.openingHours.isOpen ? 'Open' : 'Closed',
						openingHours: item.openingHours.text
					});
				}
				var gotoUrl = '#';
				var addressLine1 = ' ';
				var addressLine2 = ' ';
				var contactLine = ' ';
				var controls = ' ';
				if(item.detailed) {
					var shareUrl = '#';
					var shareClass = '#';
					gotoUrl = item.detailed.view;
					var add = item.detailed.location.address;
					if(add) {
						var addComp = Utility.removeInvalid([add.street, add.county, add.district], function(it) { return it; });
						addressLine1 = Utility.join(addComp, ', ');
						addressLine2 = Utility.join([add.city, add.postalCode], ' - ');
					}
					var contacts = item.detailed.contacts;
					var primaryPhone = null;
					if(contacts) {
						var phones = contacts.phone;
						primaryPhone = (phones && phones.length) ? phones[0].value : null;
						var phonesFormatted = Utility.collect(phones ? phones : [], function(it) { return it.label + ': ' + it.value; });
						contactLine = Utility.join(phonesFormatted, ', ');
					}
					controls = TemplateProvider.parse(controlsTemplate, {
						open: {
							href: gotoUrl,
							cssClass: gotoUrl == '#' ? 'disabled-link' : ''
						},
						share: {
							href: 'whatsapp://send?text=Shared from Hello Doc! ' + encodeURIComponent(gotoUrl),
							dataAction: 'share/whatsapp/share',
							cssClass: gotoUrl == '#' ? 'disabled-link' : ''
						},
						phone: {
							href: primaryPhone ? 'tel:' + primaryPhone : '#',
							cssClass: primaryPhone? '' : 'disabled-link'
						}
					});
				}
				var placeItem = TemplateProvider.parse(placeItemTemplate, {
					position: { lat: item.position[0], lng: item.position[1] },
					place: item,
					gotoUrl: gotoUrl, 
					addressLine1: addressLine1, 
					addressLine2: addressLine2, 
					contact: contactLine,
					availability: avail,
					controls: controls
				});
				$(container + ' .places .list-group').append(placeItem);
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
			show: function(obj) { addPlaces(obj); toggle(true);},
			hide: function() { toggle(false);},
			toggle: toggle
		};
	};
	return instance;
	  
});
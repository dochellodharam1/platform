define(['jquery', 'lib/Utility', 'lib/TemplateProvider'], function($, Utility, TemplateProvider) {
	var chatBoxTemplate = TemplateProvider.template(function() {/*_TEMPLATE_
		<div id="chatbox" class="col-sm-3 chatbox" style="display: ${display}">
			<ul></ul>
			<div>
				<div class="msj-rta macro" style="margin:auto;position: absolute; bottom: 5px; width: 100%;">                        
					<div class="text text-r" style="background:whitesmoke !important">
						<input class="mytext" placeholder="Type a message"/>
					</div> 
				</div>
			</div>
		</div> 
	_TEMPLATE_*/});
	
	var chatTemplate = TemplateProvider.template(function() {/*_TEMPLATE_
		<li id=${id} style="width:100%;">
			<div class="{macroStyleClass}">
				<div class="${alignStyleClass}">
					<p class="text">${text}</p>
					<p class="time"><small>${date}</small></p>
				</div>
			<div class="avatar" style="padding:0px 0px 0px 10px !important"></div>                              
		</li>
	_TEMPLATE_*/});
	
	var formatAMPM = function(date) {
		var hours = date.getHours();
		var minutes = date.getMinutes();
		var ampm = hours >= 12 ? 'PM' : 'AM';
		hours = hours % 12;
		hours = hours ? hours : 12; // the hour '0' should be '12'
		minutes = minutes < 10 ? '0'+minutes : minutes;
		var strTime = hours + ':' + minutes + ' ' + ampm;
		return strTime;
	};
	
	var instance = function(settings) {
	settings = settings || {callbacks : {} };
		var dummyFn = function(param) {};
		var defaults = {
			container: '',
			display: 'block',
			callbacks: {
				onChatSend: dummyFn
			}
		};
		var container = settings.container || defaults.container;
		var inputBox = settings.inputBox || defaults.inputBox;
		var display = settings.display || defaults.display;
		var msgContainer = "#chatbox ul"; 
		
		$(container).append(TemplateProvider.parse(chatBoxTemplate, {'display': display}));
		
		var onChatSend = settings.callbacks.onChatSend || defaults.callbacks.onChatSend;
		
		var insertChatFn = function(param) {
			var id = param.id;
			var who = param.who;
			var text = param.text;
			var delay = param.delay || 0;
			var control = null;
			var amI = (who == "me");
			var macroStyleClass = amI ? "msj macro" : "msj-rta macro" ;
			var alignStyleClass = amI ? "text text-l" : "text text-r" ;
			var date = formatAMPM(new Date());
			var data = {
				'id': id,
				'macroStyleClass': macroStyleClass,
				'alignStyleClass': alignStyleClass,
				'text': text,
				'date': date
			};
			if(id) {
				var control = $('#' + id);
				if(control.length) {
					control.find("p.text").html(text);
				} else {
					control = TemplateProvider.parse(chatTemplate, data);
					setTimeout(function(){ $(msgContainer).append(control); }, delay);
				}
			} else {
				control = TemplateProvider.parse(chatTemplate, data);
				setTimeout(function(){ $(msgContainer).append(control); }, delay);
			}
		};

		var clearChatFn = function() {
			$(msgContainer).empty();
		}
	
		$('#chatbox input.mytext').on("keyup", function(e) {
			if (e.which == 13) {
				var text = $(this).val();
				if (text !== "") {
					var param = {who: "me", text: text};
					insertChatFn(param);          
					$(this).val('');
					onChatSend(param);
				}
			}
		});
		
		var toggle = function(c, bool) {
			var div = $(container + ' #chatbox');
			if(bool == 'undefined') {
				return div.toggle();
			}
			return div.toggle(bool);
		};
		
		return {
			insertChat: insertChatFn,
			clearChat: clearChatFn,
			
			show: function() { toggle(true);},
			hide: function() { toggle(false);},
			toggle: toggle
		};
	};
	
	return instance;
});

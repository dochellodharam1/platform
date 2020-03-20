define(['jquery'], function($) {
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
	
	var prepareChatMsg = function(id, who, text) {
		var amI = (who == "me");
		var macroStyleClass = amI ? "msj macro" : "msj-rta macro" ;
		var alignStyleClass = amI ? "text text-l" : "text text-r" ;
		var date = formatAMPM(new Date());
		var idF = id ? ' id="' + id + '"' : ' '; 
		var avatar = amI ? '' : '<div class="avatar" style="padding:0px 0px 0px 10px !important"></div>';
		var control = '<li' + idF + ' style="width:100%;">' +
							'<div class="' + macroStyleClass + '">' +
								'<div class="' + alignStyleClass + '">' +
									'<p class="text">' + text + '</p>' +
									'<p class="time"><small>' + date + '</small></p>' +
								'</div>' +
							avatar +                                
					  '</li>';
		return control;
	};
	
	var instance = function(settings) {
	settings = settings || {callbacks : {} };
		var dummyFn = function(param) {};
		var defaults = {
			chatContainer: "#chatbox",
			inputBox: ".mytext",
			callbacks: {
				onChatSend: dummyFn
			}
		};
		var chatContainer = settings.chatContainer || defaults.chatContainer;
		var inputBox = settings.inputBox || defaults.inputBox;
		var msgContainer = chatContainer + " ul"; 
		
		var onChatSend = settings.callbacks.onChatSend || defaults.callbacks.onChatSend;
		
		var insertChatFn = function(param) {
			var id = param.id;
			var who = param.who;
			var text = param.text;
			var delay = param.delay || 0;
			var control = null;
			if(id) {
				var control = $('#' + id);
				if(control.length) {
					control.find("p.text").html(text);
				} else {
					control = prepareChatMsg(id, who, text);
					setTimeout(function(){ $(msgContainer).append(control); }, delay);
				}
			} else {
				control = prepareChatMsg(id, who, text);
				setTimeout(function(){ $(msgContainer).append(control); }, delay);
			}
		};

		var clearChatFn = function() {
			$(msgContainer).empty();
		}
	
		$(inputBox).on("keyup", function(e) {
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
		
		return {
			insertChat: insertChatFn,
			clearChat: clearChatFn
		};
	};
	
	return instance;
});

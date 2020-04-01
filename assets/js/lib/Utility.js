define(['jquery', 'timeAgo', 'textSimilarity'], function($, timeAgo, textSimilarity) {

	var generateGuid = function() {
		var result, i, j;
		result = '';
		for(j=0; j<32; j++) {
			if( j == 8 || j == 12 || j == 16 || j == 20) 
				result = result + '-';
			i = Math.floor(Math.random()*16).toString(16).toUpperCase();
			result = result + i;
		}
		return result;
	}
	
	var hashCode = function(str) {
		var hash = 0, i, chr;
		for (i = 0; i < str.length; i++) {
			chr   = str.charCodeAt(i);
			hash  = ((hash << 5) - hash) + chr;
			hash |= 0; // Convert to 32bit integer
		}
		return hash;
	};
	
	var extractInitials = function(str) {
		var tokens = str.split(' ');
		var initials = '';
		for(var i=0; i < tokens.length; i++) {
			var token = tokens[i];
			if(token.length) {
				initials += token[0];
			}
		}
		return initials;
	};
	
	var extractValueAndUnit = function(str) {
		var value = str.match(/(\d+)/)[0];
		var unit = str.replace(/[0-9]/g, '');
		return {
			'value': parseFloat(value),
			'unit': unit
		};
	};
	
	var enableToString = function(obj) {
		if(typeof obj == 'object') {
			obj.toString = (function(o) {
				return function() {
					var str = '{';
					for(var p in o) {
						var v = o[p];
						str += '"' + p + '": "' + v + '"';
					}
					str += '}';
					return str;
				};
			})(o);
		}
	};
	
	var collectFn = function(arr, fn) {
		var collected = [];
		for(var i = 0; i < arr.length; i++) {
			collected.push(fn(arr[i]));
		}
		return collected;
	};
	
	var findFirstFn = function(arr, fn) {
		for(var i = 0; i < arr.length; i++) {
			var item = arr[i];
			if(fn(item)) {
				return item;
			}
		}
		return null;
	};
	
	var joinFn = function(arr, del) {
		var joined = arr[0];
		for(var i = 1; i < arr.length; i++) {
			joined += del + arr[i];
		}
		return joined;
	};
	
	var findBestMatchedStringFn = function(str, arr) {
		debugger;
		var res = textSimilarity.findBestMatch(str, arr);
		return res.bestMatch.target;
	};
	
	return {
		generateGuid: generateGuid,
		hashCode: hashCode,
		extractInitials: extractInitials,
		extractValueAndUnit: extractValueAndUnit,
		formatByTimeAgo: timeAgo.format,
		enableToString: enableToString,
		collect: collectFn,
		findFirst: findFirstFn,
		join: joinFn,
		findBestMatchedString: findBestMatchedStringFn 
	};
});
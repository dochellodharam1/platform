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
					var first = true;
					for(var p in o) {
						var v = o[p];
						var separator = first ? '' : ',';
						if(typeof v == 'string') {
							str += separator + '"' + p + '": "' + v + '"';
							first = false;
						}
					}
					str += '}';
					return str;
				};
			})(obj);
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
		var res = textSimilarity.findBestMatch(str, arr);
		return res.bestMatch.target;
	};
	
	var onWindowResizeFn = function(fn) {
		var onWindowSizeChange = function() {
			fn({
				'width': window.innerWidth,
				'height': window.innerHeight
			});
		};
		window.onresize = onWindowSizeChange;
		window.onload = onWindowSizeChange;
		onWindowSizeChange();
	};
	
	var fitOnWindowResizeFn = function(obj) {
		var includedHeight = function(h, item) {return h + (item ? $(item).height() : 0);};
		(function(sc, it, iTop, iBottom, ar, prop) {
			ar = ar ? ar : 0.5;
			prop = prop ? prop : 'padding';
			onWindowResizeFn(function(size) {
				var staticSize = 0;
				for(var i = 0; i < sc.length; i++) {
					staticSize += $(sc[i]).height();
				}
				var expandableHeight = size.height - staticSize;
				var itemHeight = $(it).height();
				if(itemHeight < expandableHeight) {
					var extraHeight = expandableHeight - itemHeight;
					var paddingTop = includedHeight(extraHeight * ar, iTop);
					var paddingBottom = includedHeight(extraHeight  * (1 - ar), iBottom);
					$(it).css(prop + '-top', paddingTop + 'px');
					$(it).css(prop + '-bottom', paddingBottom + 'px');
				}
			});
		})(obj.staticContainers, obj.itemToFit, obj.includeTopHeightFor, obj.includeBottomHeightFor, obj.topToBottomRatio, obj.useProp);
	};
	
	var removeInvalidFn = function(arr, fn){
		var newArr = [];
		for(var i = 0; i < arr.length; i++) {
			var it = arr[i];
			if(fn(it)) {
				newArr.push(it);
			}
		}
		return newArr;
	};
	
	var probablityToPercentageFn = function(prob, fixed){
		return (prob * 100).toFixed(fixed);
	};
	
	var percentageToProbablityFn = function(perc, fixed) {
		return (perc * 0.01).toFixed(fixed);
	};
	
	var sortFn = function(arr, fn) {
		if(arr.length == 0 || arr.length == 1) {
			return arr;
		}
		var newArr = [arr[0]];
		for(var i = 1; i < arr.length; i++) {
			var it = arr[i];
			var index = newArr.length;
			for(var j = 0; j < newArr.length; j++) {
				var comparedResult = fn(newArr[j], it);
				if(comparedResult < 0 ){
					index = j;
					break;
				} else if(comparedResult == 0 ){
					index = j;
					break;
				} else {
					continue;
				}
			}
			newArr.splice(index, 0, it);
		}
		return newArr;
	};
	
	var compareStrFn = function(str1, str2){
		return str1.localeCompare(str2);
	}
	
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
		findBestMatchedString: findBestMatchedStringFn ,
		onWindowResize: onWindowResizeFn,
		fitOnWindowResize: fitOnWindowResizeFn,
		removeInvalid: removeInvalidFn,
		probablityToPercentage: probablityToPercentageFn,
		percentageToProbablity: percentageToProbablityFn,
		sort: sortFn,
		compareStr: compareStrFn
	};
});
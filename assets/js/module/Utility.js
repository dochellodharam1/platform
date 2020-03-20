define(['jquery'], function($) {
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
	
	return {
		generateGuid: generateGuid,
		hashCode: hashCode
	};
});
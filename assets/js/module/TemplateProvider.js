define(['jquery'], function(jq) {
	
	var parseFn = function(template, data) {
		return template.replace(/\$\{([^}]+)\}/g, function(outer, inner, pos) {
			var value = "${" + inner + "}";
			var depth = inner.split(".");
			if(depth.length > 1) {
				var obj = data;
				for(var i = 0; i < depth.length; i++) {
					obj = obj[depth[i]];
				}
				return obj ? obj : value;
			}
			return data[inner] ? data[inner] : value;
		});
	};
	
	var templatizeFn = function(fn, data) {
		var template = fn.toString().split('_TEMPLATE_')[1];
		return data ? parseFn(template, data) : template;
	};
	
	return {
		template: templatizeFn,
		parse: parseFn
	};
});
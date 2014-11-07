(function () {

	'use strict';
	
	var __imports_0 = require('./b');
	
	/* jshint esnext:true */
	
	exports.default = { a: 1, get b() { return __imports_0.default.b; } };

}).call(global);
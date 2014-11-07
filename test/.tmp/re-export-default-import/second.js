(function (__export) {

	'use strict';
	
	__export('hi', function () { return __imports_0.default; });
	
	var __imports_0 = require('./first');
	
	/* jshint esnext:true */

}).call(global, function(prop, get) {

	Object.defineProperty(exports, prop, {
		enumerable: true,
		get: get,
		set: function () {
			throw new Error('Cannot reassign imported binding of namespace `' + prop + '`');
		}
	});

});
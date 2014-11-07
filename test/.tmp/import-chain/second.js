(function (__export) {

	'use strict';
	
	__export('value', function () { return __imports_0.value; });
	
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
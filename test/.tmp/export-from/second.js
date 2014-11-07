(function (__export) {

	'use strict';
	
	__export('a', function () { return __imports_0.a; });
	
	var __imports_0 = require('./first');
	
	/* jshint esnext:true */
	
	assert.equal(typeof a, 'undefined');

}).call(global, function(prop, get) {

	Object.defineProperty(exports, prop, {
		enumerable: true,
		get: get,
		set: function () {
			throw new Error('Cannot reassign imported binding of namespace `' + prop + '`');
		}
	});

});
(function (__export) {

	'use strict';
	
	__export('b', function () { return b; });
	
	var __imports_0 = require('./first');
	
	/* jshint esnext:true */
	
	var a_ = __imports_0.a, b = 9, c = 'c';
	
	assert.equal(__imports_0.a, 1);
	assert.equal(a_, 1);
	assert.equal(b, 9);
	assert.equal(c, 'c');

}).call(global, function(prop, get) {

	Object.defineProperty(exports, prop, {
		enumerable: true,
		get: get,
		set: function () {
			throw new Error('Cannot reassign imported binding of namespace `' + prop + '`');
		}
	});

});
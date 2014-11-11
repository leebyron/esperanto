(function () {

	'use strict';

	var __imports_0 = require('./first');
	
	/* jshint esnext:true */
	
	var a_ = __imports_0.a, b = 9, c = 'c';
	
	assert.equal(__imports_0.a, 1);
	assert.equal(a_, 1);
	assert.equal(b, 9);
	assert.equal(c, 'c');
	
	exports.b = b;

}).call(global);
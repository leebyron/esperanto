(function () {

	'use strict';
	
	var __imports_0 = require('./a');
	var __imports_1 = require('./b');
	
	/* jshint esnext:true */
	
	assert.equal(__imports_1.geta(), 1);
	assert.equal(__imports_0.a, 1);
	assert.equal(__imports_0.getb(), 2);
	assert.equal(__imports_1.b, 2);

}).call(global);
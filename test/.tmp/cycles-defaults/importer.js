(function () {

	'use strict';
	
	var __imports_0 = require('./a');
	var __imports_1 = require('./b');
	
	/* jshint esnext:true */
	
	assert.equal(__imports_0.default.a, 1);
	assert.equal(__imports_0.default.b, 2);
	assert.equal(__imports_1.default.a, 1);
	assert.equal(__imports_1.default.b, 2);

}).call(global);
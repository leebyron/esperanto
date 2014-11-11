(function () {

	'use strict';

	var __imports_0 = require('./exporter');
	
	/* jshint esnext:true */
	
	assert.equal(__imports_0.a, 1);
	assert.equal(__imports_0.b, 2);
	__imports_0.incr();
	assert.equal(__imports_0.a, 2);
	assert.equal(__imports_0.b, 3);

}).call(global);
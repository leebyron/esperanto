(function () {

	'use strict';
	
	var __imports_0 = require('./exporter');
	
	/* jshint esnext:true */
	
	assert.equal(__imports_0.count, 0);
	__imports_0.incr();
	assert.equal(__imports_0.count, 1);

}).call(global);
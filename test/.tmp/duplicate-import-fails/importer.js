(function () {

	'use strict';
	
	var __imports_0 = require('./exporter');
	var __imports_1 = require('./exporter');
	
	/* jshint esnext:true */
	
	/* error: type=SyntaxError message="expected one declaration for `a`, at importer.js:7:14 but found 2" */
	assert.equal(__imports_1.a, 1);

}).call(global);
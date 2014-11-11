(function () {

	'use strict';

	var __imports_0 = require('./exporter');
	
	/* jshint esnext:true */
	
	/* error: type=SyntaxError message="expected one declaration for `a`, at importer.js:5:14 but found 2" */
	assert.equal(__imports_0.a, 1);

}).call(global);
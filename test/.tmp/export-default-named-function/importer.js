(function () {

	'use strict';
	
	var __imports_0 = require('./exporter');
	
	assert.strictEqual(__imports_0.default(), 1);
	assert.strictEqual(__imports_0.callsFoo(), 1);

}).call(global);
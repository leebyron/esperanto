(function(){
	'use strict';
	
	module.exports = 'baz';
	
	var foo = require('foo');
	require('polyfills');
	
	exports.default = 'baz';
}).call(global);
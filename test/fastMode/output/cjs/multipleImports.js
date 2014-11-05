(function(){
	'use strict';
	
	module.exports = qux;
	
	var foo = require('foo');
	var bar = require('bar');
	var baz = require('baz');
	
	var qux = foo( bar( baz ) );
	exports.default = qux;
}).call(global);
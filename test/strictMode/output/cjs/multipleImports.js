(function(){
	'use strict';
	
	(function (__export) {
	;
	}(function(prop,get) {
		Object.defineProperty(exports,prop,{enumerable:true,get:get,set:function(){throw new Error('Cannot reassign imported binding of namespace `'+prop+'`');}});
	}));
	
	var __imports_0 = require('foo');
	var __imports_1 = require('bar');
	var __imports_2 = require('baz');
	
	var qux = __imports_0.default( __imports_1.default( __imports_2.default ) );
	exports.default = qux;
}).call(global);
define(['exports','foo','polyfills'],function (exports, __imports_0) {

	'use strict';
	
	var foo = __imports_0.default;
	
	
	import foo from 'foo';
	import 'polyfills';
	
	export default 'baz';
	
	
	(function (__export) {
	;
	}(function(prop,get) {
		Object.defineProperty(exports,prop,{enumerable:true,get:get,set:function(){throw new Error('Cannot reassign imported binding of namespace `'+prop+'`');}});
	}));

});
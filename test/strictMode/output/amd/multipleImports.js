define(['exports','foo','bar','baz'],function (exports, __imports_0, __imports_1, __imports_2) {

	'use strict';
	
	var foo = __imports_0.default;
	var bar = __imports_1.default;
	var baz = __imports_2.default;
	
	import foo from 'foo';
	import bar from 'bar';
	import baz from 'baz';
	
	var qux = foo( bar( baz ) );
	export default qux;
	
	
	(function (__export) {
	;
	}(function(prop,get) {
		Object.defineProperty(exports,prop,{enumerable:true,get:get,set:function(){throw new Error('Cannot reassign imported binding of namespace `'+prop+'`');}});
	}));

});
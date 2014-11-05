define(['exports'],function (exports) {

	'use strict';
	
	export let foo = 'bar';
	
	
	(function (__export) {
		__export('foo', function(){return foo;});
	}(function(prop,get) {
		Object.defineProperty(exports,prop,{enumerable:true,get:get,set:function(){throw new Error('Cannot reassign imported binding of namespace `'+prop+'`');}});
	}));

});
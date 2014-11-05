define(['exports'],function (exports) {

	'use strict';
	
	var foo = 'bar', answer = 42;
	export { foo, answer };
	
	
	(function (__export) {
		__export('foo', function(){return foo;})
		__export('answer', function(){return answer;});
	}(function(prop,get) {
		Object.defineProperty(exports,prop,{enumerable:true,get:get,set:function(){throw new Error('Cannot reassign imported binding of namespace `'+prop+'`');}});
	}));

});
define(['exports'],function (exports) {

	'use strict';
	
	export default foo;
	
	function foo () {
		console.log( 'fooing' );
	}
	
	
	(function (__export) {
	;
	}(function(prop,get) {
		Object.defineProperty(exports,prop,{enumerable:true,get:get,set:function(){throw new Error('Cannot reassign imported binding of namespace `'+prop+'`');}});
	}));

});
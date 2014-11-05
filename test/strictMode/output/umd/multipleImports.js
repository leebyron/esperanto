(function (global, factory) {

	'use strict';

	if (typeof define === 'function' && define.amd) {
		// export as AMD
		define(['exports', 'foo', 'bar', 'baz'], factory);
	} else if ( typeof module !== 'undefined' && module.exports && typeof require === 'function' ) {
		// node/browserify
		factory(exports, require('foo'), require('bar'), require('baz'));
	} else {
		// browser global
		global.myModule = {};
		factory(global.myModule, global.__foo_js, global.__bar_js, global.__baz_js);
	}

}(typeof window !== 'undefined' ? window : this, function (exports, __foo_js, __bar_js, __baz_js) {

	'use strict';
	
	var foo = __foo_js.default;
	var bar = __bar_js.default;
	var baz = __baz_js.default;
	
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

}));
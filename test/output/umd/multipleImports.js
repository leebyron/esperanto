(function (global, factory) {

	'use strict';

	if (typeof define === 'function' && define.amd) {
		// export as AMD
		define(['foo', 'bar', 'baz'], factory);
	} else if ( typeof module !== 'undefined' && module.exports && typeof require === 'function' ) {
		// node/browserify
		module.exports = factory(require('foo'), require('bar'), require('baz'));
	} else {
		// browser global
		global.myModule = factory(global.__imports_0, global.__imports_1, global.__imports_2);
	}

}(typeof window !== 'undefined' ? window : this, function (__imports_0, __imports_1, __imports_2) {

	'use strict';
	
	var __exports;
	
	var foo = __imports_0.default;
	var bar = __imports_1.default;
	var baz = __imports_2.default;
	var qux = foo( bar( baz ) );
	__exports.default = qux;
	return __exports;

}));
(function (global, factory) {

	'use strict';

	if (typeof define === 'function' && define.amd) {
		// export as AMD
		define(['foo', 'polyfills'], factory);
	} else if ( typeof module !== 'undefined' && module.exports && typeof require === 'function' ) {
		// node/browserify
		module.exports = factory(require('foo'), require('polyfills'));
	} else {
		// browser global
		global.myModule = factory(global.__imports_0);
	}

}(typeof window !== 'undefined' ? window : this, function (__imports_0) {

	'use strict';
	
	var __exports;
	
	var foo = __imports_0.default;
	__exports.default = 'baz';
	return __exports;

}));
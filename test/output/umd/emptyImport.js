(function (global, factory) {

	'use strict';

	if (typeof define === 'function' && define.amd) {
		// export as AMD
		define(['polyfills', 'foo'], factory);
	} else if ( typeof module !== 'undefined' && module.exports && typeof require === 'function' ) {
		// node/browserify
		module.exports = factory(require('polyfills'), require('foo'));
	} else {
		// browser global
		global.myModule = factory(global.__imports_0, global.__imports_1);
	}

}(typeof window !== 'undefined' ? window : this, function (__imports_0, __imports_1) {

	'use strict';
	
	var foo = __imports_1.default;

}));
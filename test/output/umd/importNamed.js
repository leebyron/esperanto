(function (global, factory) {

	'use strict';

	if (typeof define === 'function' && define.amd) {
		// export as AMD
		define(['baz'], factory);
	} else if ( typeof module !== 'undefined' && module.exports && typeof require === 'function' ) {
		// node/browserify
		module.exports = factory(require('baz'));
	} else {
		// browser global
		global.myModule = factory(global.__imports_0);
	}

}(typeof window !== 'undefined' ? window : this, function (__imports_0) {

	'use strict';
	
	var foo = __imports_0.foo;
	var bar = __imports_0.bar;

}));
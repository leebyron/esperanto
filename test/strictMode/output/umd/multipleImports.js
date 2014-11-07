(function (global, factory) {

	'use strict';

	if (typeof define === 'function' && define.amd) {
		// export as AMD
		define(['exports', 'foo', 'bar', 'baz'], factory);
	} else if (typeof module !== 'undefined' && module.exports && typeof require === 'function') {
		// node/browserify
		factory(exports, require('foo'), require('bar'), require('baz'));
	} else {
		// browser global
		global.myModule = {};
		factory(global.myModule,  global.__foo_js,  global.__bar_js,  global.__baz_js);
	}

}(typeof window !== 'undefined' ? window : this, function (exports, __foo_js, __bar_js, __baz_js) {

	'use strict';

	var qux = __foo_js.default( __bar_js.default( __baz_js.default ) );
	exports.default = qux;

}));
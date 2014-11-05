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
		global.myModule = factory(global.__baz_js);
	}

}(typeof window !== 'undefined' ? window : this, function (__baz_js) {

	'use strict';
	
	var foo = __baz_js.foo;
	var bar = __baz_js.bar;
	
	import { foo, bar } from 'baz';

}));
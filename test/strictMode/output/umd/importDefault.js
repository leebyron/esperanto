(function (global, factory) {

	'use strict';

	if (typeof define === 'function' && define.amd) {
		// export as AMD
		define(['foo'], factory);
	} else if (typeof module !== 'undefined' && module.exports && typeof require === 'function') {
		// node/browserify
		factory(require('foo'));
	} else {
		// browser global
		global.myModule = {};
		factory(global.__foo_js);
	}

}(typeof window !== 'undefined' ? window : this, function (__foo_js) {

	'use strict';

	console.log( __foo_js.default );

}));
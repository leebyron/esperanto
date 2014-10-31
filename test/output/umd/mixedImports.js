(function (global, factory) {

	'use strict';

	if (typeof define === 'function' && define.amd) {
		// export as AMD
		define(['asap'], factory);
	} else if ( typeof module !== 'undefined' && module.exports && typeof require === 'function' ) {
		// node/browserify
		module.exports = factory(require('asap'));
	} else {
		// browser global
		global.myModule = factory(global.__imports_0);
	}

}(typeof window !== 'undefined' ? window : this, function (__imports_0) {

	'use strict';
	
	var asap = __imports_0.default;
	var later = __imports_0.later;

}));
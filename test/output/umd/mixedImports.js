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
		global.myModule = factory(global.__asap);
	}

}(typeof window !== 'undefined' ? window : this, function (__asap) {

	'use strict';
	
	var asap = __asap.default;
	var later = __asap.later;

}));
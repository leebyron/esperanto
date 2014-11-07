(function (global, factory) {

	'use strict';

	if (typeof define === 'function' && define.amd) {
		// export as AMD
		define(['asap'], factory);
	} else if (typeof module !== 'undefined' && module.exports && typeof require === 'function') {
		// node/browserify
		factory(require('asap'));
	} else {
		// browser global
		global.myModule = {};
		factory(global.__asap_js);
	}

}(typeof window !== 'undefined' ? window : this, function (__asap_js) {

	'use strict';

	

}));
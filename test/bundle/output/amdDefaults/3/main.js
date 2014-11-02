(function (global, factory) {

	'use strict';

	if (typeof define === 'function' && define.amd) {
		// export as AMD
		define(['external'], factory);
	} else if ( typeof module !== 'undefined' && module.exports && typeof require === 'function' ) {
		// node/browserify
		module.exports = factory(require('external'));
	} else {
		// browser global
		global.undefined = factory();
	}

}(typeof window !== 'undefined' ? window : this, function () {

	'use strict';
	
	var foo = 'yes';
	
	
	(function () {
		console.log( external( foo ) );
	}());

}));
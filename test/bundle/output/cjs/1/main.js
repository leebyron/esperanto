(function (global, factory) {

	'use strict';

	if (typeof define === 'function' && define.amd) {
		// export as AMD
		define(['exports'], factory);
	} else if ( typeof module !== 'undefined' && module.exports && typeof require === 'function' ) {
		// node/browserify
		factory(exports);
	} else {
		// browser global
		global.undefined = {};
		factory(global.undefined);
	}

}(typeof window !== 'undefined' ? window : this, function (exports) {

	'use strict';
	
	var foo = {};
	(function () {
		var message = 'yes';
		
		exports.default = message;
	}());
	
	(function () {
		var foo = foo.default;
		
		console.log( foo );
	}());

}));
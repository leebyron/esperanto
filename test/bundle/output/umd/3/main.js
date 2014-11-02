(function (global, factory) {

	'use strict';

	if (typeof define === 'function' && define.amd) {
		// export as AMD
		define(['exports', 'external'], factory);
	} else if ( typeof module !== 'undefined' && module.exports && typeof require === 'function' ) {
		// node/browserify
		factory(exports, require('external'));
	} else {
		// browser global
		global.myModule = {};
		factory(global.myModule);
	}

}(typeof window !== 'undefined' ? window : this, function (exports) {

	'use strict';
	
	var foo = {};
	(function () {
		var bar = 'yes';
		
		exports.default = bar;
	}());
	
	(function () {
		var foo = foo.default;
		var external = external.default;
		
		console.log( external( foo ) );
	}());

}));
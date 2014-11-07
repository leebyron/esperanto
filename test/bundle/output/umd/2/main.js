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
		global.myModule = {};
		factory(global.myModule);
	}

}(typeof window !== 'undefined' ? window : this, function (exports) {

	'use strict';
	
	var foo = {};
	(function () {
		var bar = 'yes';
		export default bar;
	}());
	
	(function () {
		var foo = foo.default;
		
		import foo from './foo';
		console.log( foo );
	}());

}));
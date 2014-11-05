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
		export default message;
		
		
		(function (__export) {
		;
		}(function(prop,get) {
			Object.defineProperty(exports,prop,{enumerable:true,get:get,set:function(){throw new Error('Cannot reassign imported binding of namespace `'+prop+'`');}});
		}));
	}());
	
	(function () {
		var foo = foo.default;
		
		import foo from './foo';
		console.log( foo );
	}());

}));
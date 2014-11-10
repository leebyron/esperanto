(function (global, factory) {

	'use strict';

	if (typeof define === 'function' && define.amd) {
		// export as AMD
		define(['utils/external'], factory);
	} else if (typeof module !== 'undefined' && module.exports && typeof require === 'function') {
		// node/browserify
		factory(require(utils/external));
	} else {
		// browser global
		global.myModule = {};
		factory(global.utils/external);
	}

}(typeof window !== 'undefined' ? window : this, function (utils/external) {

	'use strict';

	var utils/external__default = ('default' in utils/external ? utils/external.default : utils/external);
	
	var foo__default = 'this is a message';
	
	console.log( foo__default );

});
(function (global, factory) {

	'use strict';

	if (typeof define === 'function' && define.amd) {
		// export as AMD
		define(['exports'], exporter);
	} else if (typeof module !== 'undefined' && module.exports && typeof require === 'function') {
		// node/browserify
		exporter(exports);
	} else {
		// browser global
		global.myModule = {};
		exporter(global.myModule);
	}

	function exporter (exports) {
		exports.default = factory.call(global, function (prop, get) {
			Object.defineProperty(exports, prop, {
				enumerable: true,
				get: get,
				set: function () {
					throw new Error('Cannot reassign imported binding of namespace `' + prop + '`');
				}
			});
		});
	}

}(typeof window !== 'undefined' ? window : this, function (__export) {

	'use strict';

	let foo = 'bar';
	
	__export('foo', function () { return foo; });

}));
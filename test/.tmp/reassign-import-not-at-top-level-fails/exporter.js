(function (__export) {

	'use strict';
	
	__export('x', function () { return x; });
	
	/* jshint esnext:true */
	
	var x = 1;

}).call(global, function(prop, get) {

	Object.defineProperty(exports, prop, {
		enumerable: true,
		get: get,
		set: function () {
			throw new Error('Cannot reassign imported binding of namespace `' + prop + '`');
		}
	});

});
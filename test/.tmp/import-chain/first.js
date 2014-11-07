(function (__export) {

	'use strict';
	
	__export('value', function () { return value; });
	
	/* jshint esnext:true */
	
	var value = 42;

}).call(global, function(prop, get) {

	Object.defineProperty(exports, prop, {
		enumerable: true,
		get: get,
		set: function () {
			throw new Error('Cannot reassign imported binding of namespace `' + prop + '`');
		}
	});

});
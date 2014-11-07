(function (__export) {

	'use strict';
	
	__export('foo', function () { return foo; });
	
	let foo = 'bar';

}).call(global, function(prop, get) {

	Object.defineProperty(exports, prop, {
		enumerable: true,
		get: get,
		set: function () {
			throw new Error('Cannot reassign imported binding of namespace `' + prop + '`');
		}
	});

});
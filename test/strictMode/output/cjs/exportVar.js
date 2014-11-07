(function (__export) {

	'use strict';
	
	__export('foo', function () { return foo; });
	
	var foo = 'bar';

}).call(global, function(prop, get) {

	Object.defineProperty(exports, prop, {
		enumerable: true,
		get: get,
		set: function () {}
	});

});
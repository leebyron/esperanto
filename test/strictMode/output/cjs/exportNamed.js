(function (__export) {

	'use strict';
	
	__export('foo', function () { return foo; });
	__export('answer', function () { return answer; });
	
	var foo = 'bar', answer = 42;

}).call(global, function(prop, get) {

	Object.defineProperty(exports, prop, {
		enumerable: true,
		get: get,
		set: function () {}
	});

});
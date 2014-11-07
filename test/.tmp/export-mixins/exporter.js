(function (__export) {

	'use strict';
	
	
	__export('bar', function () { return bar; });
	
	exports.default = 1;
	var bar = 2;

}).call(global, function(prop, get) {

	Object.defineProperty(exports, prop, {
		enumerable: true,
		get: get,
		set: function () {}
	});

});
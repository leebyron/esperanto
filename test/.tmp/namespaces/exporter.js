(function (__export) {

	'use strict';
	
	__export('a', function () { return a; });
	__export('b', function () { return b; });
	
	
	/* jshint esnext:true */
	
	var a = 'a';
	var b = 'b';
	exports.default = 'DEF';

}).call(global, function(prop, get) {

	Object.defineProperty(exports, prop, {
		enumerable: true,
		get: get,
		set: function () {}
	});

});
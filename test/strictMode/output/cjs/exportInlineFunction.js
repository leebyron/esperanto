(function () {

	'use strict';

	function foo ( str ) {
		return str.toUpperCase();
	}
	
	exports.foo = foo;

}).call(global);
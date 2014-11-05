(function(){
	'use strict';
	
	module.exports = function foo ( str ) {
		return str.toUpperCase();
	};
	
	function foo ( str ) {
		return str.toUpperCase();
	}
	exports.default = foo;
}).call(global);
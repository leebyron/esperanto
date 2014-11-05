(function(){
	'use strict';
	
	module.exports = foo;
	
	exports.default = foo;
	
	function foo () {
		console.log( 'fooing' );
	}
}).call(global);
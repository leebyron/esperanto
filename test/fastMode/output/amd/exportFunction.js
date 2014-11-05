define(function () {

	'use strict';
	
	export default function foo ( str ) {
		return str.toUpperCase();
	}
	
	return function foo ( str ) {
		return str.toUpperCase();
	};

});
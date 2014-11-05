define(['foo','polyfills'],function (foo) {

	'use strict';
	
	import foo from 'foo';
	import 'polyfills';
	
	export default 'baz';
	
	return 'baz';

});
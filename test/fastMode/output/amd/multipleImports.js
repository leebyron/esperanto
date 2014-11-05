define(['foo','bar','baz'],function (foo, bar, baz) {

	'use strict';
	
	import foo from 'foo';
	import bar from 'bar';
	import baz from 'baz';
	
	var qux = foo( bar( baz ) );
	export default qux;
	
	return qux;

});
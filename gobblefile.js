var gobble = require( 'gobble' ),
	lib = require( './gobble/lib' ).moveTo( 'lib' ),
	dist = require( './gobble/dist' ).moveTo( 'dist' );

module.exports = gobble([
	lib,
	// dist,
	// dist.transform( 'uglifyjs', { ext: '.min.js' })
]);

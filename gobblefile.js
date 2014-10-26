var fs = require( 'fs' ),
	resolve = require( 'path' ).resolve,
	gobble = require( 'gobble' ),
	dist,
	lib;

gobble.cwd( __dirname );

// Compile a UMD version, via RequireJS and AMDClean
dist = gobble( 'src' ).transform( 'esperanto', { defaultOnly: true, addUseStrict: false })
	.transform( 'requirejs', {
		out: 'esperanto.js',
		name: 'esperanto',
		paths: {
			acorn: 'empty:'
		},
		exclude: [ 'acorn' ],
		optimize: 'none'
	})
	.transform( 'amdclean', {
		wrap: {
			start: fs.readFileSync( resolve( __dirname, 'wrapper/start.js' ) ).toString(),
			end: fs.readFileSync( resolve( __dirname, 'wrapper/end.js' ) ).toString()
		}
	})
	.transform( 'jsbeautify', {
		indent_with_tabs: true,
		preserve_newlines: true
	}).moveTo( 'dist' );

lib = gobble( 'src' ).transform( 'esperanto', { type: 'cjs', defaultOnly: true });

if ( gobble.env() === 'test' ) {
	module.exports = lib;
} else {
	module.exports = gobble([
		dist,
		dist.transform( 'uglifyjs', { ext: '.min.js' }),

		// Compile a node.js version
		lib.moveTo( 'lib' )
	]);
}
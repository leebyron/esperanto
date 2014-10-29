var fs = require( 'fs' ),
	resolve = require( 'path' ).resolve,
	gobble = require( 'gobble' );

gobble.cwd( __dirname, '..' );

module.exports = gobble( 'src' ).transform( 'esperanto', { defaultOnly: true, addUseStrict: false })
	.transform( 'es6-transpiler', { globals: { define: true }})
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
			start: fs.readFileSync( resolve( __dirname, '../wrapper/start.js' ) ).toString(),
			end: fs.readFileSync( resolve( __dirname, '../wrapper/end.js' ) ).toString()
		}
	})
	.transform( 'jsbeautify', {
		indent_with_tabs: true,
		preserve_newlines: true
	});

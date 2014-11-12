var gobble = require( 'gobble' ),
	sander = require( 'sander' ),
	esperanto = require( '../' );

gobble.cwd( __dirname, '..' );

module.exports = gobble( 'src' )
	/*.transform( function ( inputdir, outputdir, options ) {
		return esperanto.bundle({
			base: inputdir,
			entry: 'esperanto'
		}).then( function ( bundle ) {
			return sander.writeFile( outputdir, 'esperanto.js', bundle.toCjs({
				defaultOnly: true
			}) );
		});
	})*/
	.transform( function ( code ) {
		return esperanto.toCjs( code, { defaultOnly: true });
	})
	.transform( 'es6-transpiler' );

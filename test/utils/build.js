module.exports = function () {
	var libdir = require( 'path' ).resolve( __dirname, '../lib' );

	return require( 'sander' ).rimraf( libdir ).then( function () {
		process.env.GOBBLE_ENV = 'test';

		return require( '../../gobblefile' ).build({
			dest: libdir
		}).then( function () {
			return require( '../lib/esperanto' );
		});
	});
};
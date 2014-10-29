var gobble = require( 'gobble' );

gobble.cwd( __dirname, '..' );

module.exports = gobble( 'src' )
	.transform( 'esperanto', { type: 'cjs', defaultOnly: true })
	.transform( 'es6-transpiler' );

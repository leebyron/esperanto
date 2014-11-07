import MagicString from 'magic-string';
import getUmdIntro from '../../../utils/getUmdIntro';

export default function Bundle$toCjs ( options ) {
	var body, importBlock, exports, intro, outro;

	body = this.body.clone();

	importBlock = this.externalModules.map( x => {
		console.log( 'x', x );
	}).join( '\n' );

	// importBlock

	// imports = this.externalModules.map( path => {
	// 	return {
	// 		path: path.replace( /\.js$/, '' ),
	// 		name: this.getModuleName( path ),
	// 		specifiers: []
	// 	};
	// });

	// exports = [ this.getModuleName( this.entry ) ];

	// intro = getUmdIntro( imports, exports, options );
	// outro = '\n\n}));';

	// body.indent().prepend( intro ).append( outro );
	return body.toString();
}

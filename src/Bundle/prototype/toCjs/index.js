import Source from '../../../Source';
import getUmdIntro from '../../../utils/getUmdIntro';

export default function Bundle$toUmd ( options ) {
	var body, imports, exports, intro, outro;

	body = this.modules.map( m => {
		return m.toStatement({
			defaultOnly: options.defaultOnly,
			name: this.getModuleName( m.file )
		});
	}).join( '\n\n' );

	body = new Source( body );

	if ( options.addUseStrict !== false ) {
		body.prepend( "'use strict';\n\n" );
	}

	imports = this.externalModules.map( path => {
		return {
			path: path.replace( /\.js$/, '' ),
			name: this.getModuleName( path ),
			specifiers: []
		};
	});
	//console.log( 'this.entry', this.entry );
	exports = [ this.getModuleName( this.entry ) ];

	intro = getUmdIntro( imports, exports, options );
	outro = '\n\n}));';

	body.indent().prepend( intro ).append( outro );
	return body.toString();
}
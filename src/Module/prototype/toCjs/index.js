import Source from '../../../Source';
import getIntro from './getIntro';
import getExportReplacement from './getExportReplacement';

export default function Module$toCjs ( options ) {
	var source,
		trailingExport,
		intro;

	source = new Source( this.source );

	// We might be able to just export the default value, rather
	// than assigning it to __exports
	trailingExport = options.defaultOnly &&
		this.exports.length === 1 &&
		this.exports[0].node === this.ast.body[ this.ast.body.length - 1 ];

	// Remove import statements, these are prepended separately
	this.imports.forEach( function ( x ) {
		source.remove( x.start, x.next );
	});

	// Replace export statements
	this.exports.forEach( function ( x ) {
		var content = getExportReplacement( x, {
			defaultOnly: options.defaultOnly,
			trailingExport: trailingExport
		});

		source.replace( x.start, x.end, content );
	});

	// Trim the fat
	source.trim();

	// If we're in defaultOnly mode, and we're exporting a default value,
	// we wrap the module body
	if ( options.defaultOnly && !trailingExport && this.exports.length ) {
		source.prepend( 'var __export;\n\n' );
		source.append( '\nmodule.exports = __export;' );
	}

	intro = getIntro( this, options ).trim();

	// console.log( 'intro "%s"', intro );
	// console.log( 'source "%s"', source.toString() );
	source.prepend( intro + '\n\n' );

	return source.toString().trim();
}
import Source from '../../../Source';
import getHeader from './getHeader';
import getExportReplacement from '../shared/getExportReplacement';
import getImportReplacement from '../shared/getImportReplacement';

export default function Module$toCjs ( options ) {
	var source,
		trailingExport,
		header;

	source = new Source( this.source );

	// We might be able to just export the default value, rather
	// than assigning it to __exports
	trailingExport = options.defaultOnly && this.hasTrailingExport;

	// Replace import statements
	this.imports.forEach( function ( x, i ) {
		var content = getImportReplacement( x, {
			defaultOnly: options.defaultOnly
		});

		source.replace( x.start, x.next, content );
	});

	// // Remove import statements, these are prepended separately
	// this.imports.forEach( function ( x ) {
	// 	// Throw error if we're using named imports in defaultOnly mode
	// 	if ( options.defaultOnly ) {
	// 		if ( x.specifiers.length > 1 ) {
	// 			throw new Error( 'Named import used in defaultOnly mode' );
	// 		}

	// 		if ( x.specifiers.length === 1 && !x.specifiers[0].default && !x.specifiers[0].batch ) {
	// 			throw new Error( 'Named import used in defaultOnly mode' );
	// 		}
	// 	}

	// 	source.remove( x.start, x.next );
	// });

	// Replace export statements
	this.exports.forEach( function ( x ) {
		var content = getExportReplacement( x, {
			defaultOnly: options.defaultOnly,
			trailingExport: trailingExport
		}, 'module.exports =' );

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

	header = getHeader( this, options );
	source.prepend( header + '\n\n' );

	return source.toString().trim();
}

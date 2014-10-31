import Source from '../../../Source';
import getHeader from './getHeader';
import getExportReplacement from '../shared/getExportReplacement';
import getImportReplacement from '../shared/getImportReplacement';

export default function Module$toUmd ( options ) {
	var source, trailingExport;

	if ( !options.name ) {
		throw new Error( 'You must specify a `name` option to export as for UMD exports' );
	}

	source = new Source( this.source );

	// We might be able to just return the exported value, rather
	// than assigning it to __exports to return later
	trailingExport = options.defaultOnly && this.hasTrailingExport;

	// Replace import statements
	this.imports.forEach( function ( x, i ) {
		var content = getImportReplacement( x, {
			defaultOnly: options.defaultOnly
		});

		source.replace( x.start, x.next, content );
	});

	source.trim();

	// Replace export statements
	this.exports.forEach( function ( x ) {
		var content = getExportReplacement( x, {
			defaultOnly: options.defaultOnly,
			trailingExport: trailingExport
		}, 'return' );

		source.replace( x.start, x.end, content );
	});

	if ( !trailingExport && !!this.exports.length ) {
		source.prepend( 'var __exports;\n\n' );
		source.append( '\nreturn __exports;' );
	}

	if ( options.addUseStrict !== false ) {
		source.prepend( "'use" + " strict';\n\n" );
	}

	source.trim();
	source.indent();

	source.prepend( getHeader( this, options ) );
	source.append( '\n\n}));' );

	return source.toString();
}

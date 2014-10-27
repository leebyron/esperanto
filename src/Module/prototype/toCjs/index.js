import Source from '../../../Source';
import getIntro from './getIntro';

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

	source.trim();

	this.exports.forEach( function ( x ) {
		var content;

		if ( x.declaration ) {
			content = x.value + '\n' + 'exports.' + x.name + ' = ' + x.name + ';';
		}

		else if ( x.specifiers ) {
			if ( options.defaultOnly ) {
				throw new Error( 'Named exports used in defaultOnly mode' );
			}

			content = x.specifiers.map( function ( specifier ) {
				return 'exports.' + specifier.name + ' = ' + specifier.name;
			}).join( ';\n' );
		}

		else {
			content = ( trailingExport ? 'module.exports = ' : ( options.defaultOnly ? '__export' : 'exports.' + x.name ) + ' = ' ) + x.value + ';';
		}

		source.replace( x.start, x.end, content );
	});

	source.trim();

	if ( options.defaultOnly && !trailingExport && this.exports.length ) {
		source.prepend( 'var __export;\n\n' );
	}

	if ( options.defaultOnly && !trailingExport && this.exports.length ) {
		source.append( 'module.exports = __export;' );
	}

	intro = getIntro( this, options );
	source.prepend( intro + '\n' );

	return source.toString();
}
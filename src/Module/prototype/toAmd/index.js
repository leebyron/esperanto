import Source from '../../../Source';
import getIntro from './getIntro';

export default function Module$toAmd ( options ) {
	var source, trailingExport;

	source = new Source( this.source );

	// We might be able to just return the exported value, rather
	// than assigning it to __exports to return later
	trailingExport = options.defaultOnly &&
		this.exports.length === 1 &&
		this.exports[0].node === this.ast.body[ this.ast.body.length - 1 ];

	// Replace import statements
	this.imports.forEach( function ( x, i ) {
		var variableDeclarations;

		if ( options.defaultOnly || x.specifiers[0] && x.specifiers[0].batch ) {
			source.remove( x.start, x.next );
		} else {
			variableDeclarations = x.specifiers.map( s => {
				if ( options.defaultOnly && !s.default ) {
					throw new Error( `Named import used in defaultOnly mode (${s.as})` );
				}

				return `var ${s.as} = ${x.name}.${s.name};\n`;
			});

			source.replace( x.start, x.next, variableDeclarations.join( '' ) );
		}
	});


	source.trim();

	this.exports.forEach( function ( x ) {
		var content;

		if ( x.declaration ) {
			if ( options.defaultOnly ) {
				throw new Error( 'Named exports used in defaultOnly mode (' + x.name + ')' );
			}

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
			content = ( trailingExport ? 'return ' : ( options.defaultOnly ? '__export' : 'exports.' + x.name ) + ' = ' ) + x.value + ';';
		}

		source.replace( x.start, x.end, content );
	});

	if ( !trailingExport && options.defaultOnly && !!this.exports.length ) {
		source.prepend( 'var __export;\n\n' );
		source.append( '\nreturn __export;' );
	}

	if ( options.addUseStrict !== false ) {
		source.prepend( "'use" + " strict';\n\n" );
	}

	source.trim();
	source.indent();

	source.prepend( getIntro( this, options ) );
	source.append( '\n\n});' );

	return source.toString();
}

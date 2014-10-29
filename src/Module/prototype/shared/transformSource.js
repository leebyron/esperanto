export default function ( source, module, options ) {
	var hasExports = !!module.exports.length,
		trailingExport;

	// We might be able to just return the exported value, rather
	// than assigning it to __exports to return later
	trailingExport = options.defaultOnly &&
		module.exports.length === 1 &&
		module.exports[0].node === module.ast.body[ module.ast.body.length - 1 ];

	// Replace import statements
	module.imports.forEach( function ( x, i ) {
		var importName, variableDeclarations;

		if ( options.defaultOnly || x.specifiers[0] && x.specifiers[0].batch ) {
			source.remove( x.start, x.next );
		} else {
			importName = '__imports_' + i;
			variableDeclarations = x.specifiers.map( function ( specifier ) {
				if ( options.defaultOnly && !specifier.default ) {
					throw new Error( 'Named import used in defaultOnly mode (' + specifier.as + ')' );
				}

				return 'var ' + specifier.as + ' = ' + importName + '.' + specifier.name + ';\n';
			});

			source.replace( x.start, x.next, variableDeclarations.join( '' ) );
		}
	});


	source.trim();

	module.exports.forEach( function ( x ) {
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

	source.trim();

	if ( !trailingExport && options.defaultOnly && hasExports ) {
		source.prepend( 'var __export;\n\n' );
		source.append( '\nreturn __export;' );
	}

	if ( options.addUseStrict !== false ) {
		source.prepend( "'use" + " strict';\n\n" );
	}

	source.trim();
	source.indent();

}

import replaceChunks from '../helpers/replaceChunks';

export default function Module$toCjs ( options ) {
	var code = '',
		imports = this.imports,
		exports = this.exports,
		intro = '',
		outro = '',
		replacements,
		singleFinalExport;

	// We might be able to just export the default value, rather
	// than assigning it to __exports
	singleFinalExport = options.defaultOnly &&
		this.exports.length === 1 &&
		this.exports[0].node === this.ast.body[ this.ast.body.length - 1 ];

	if ( options.defaultOnly ) {
		intro = imports.map( function ( x, i ) {
			return ( x.specifiers.length ? 'var ' + ( x.specifiers[0].as || x.specifiers[0].name ) + ' = ' : '' ) + 'require(\'' + x.path + '\');\n' + ( i === imports.length - 1 ? '\n' : '' );
		}).join( '\n' );
	} else {
		intro = imports.map( function ( x, i ) {
			var name = getImportName( x, i );

			return ( x.specifiers.length ? 'var ' + name + ' = ' : '' ) + 'require(\'' + x.path + '\');\n' + ( i === imports.length - 1 ? '\n' : '' );
		}).join( '\n' );

		intro += imports.filter( excludeBatchImports ).map( function ( x, i ) {
			var importName = '__imports_' + i;

			return x.specifiers.map( function ( specifier ) {
				return 'var ' + specifier.as + ' = ' + importName + '.' + specifier.name + ';';
			}).join( '\n' );
		}).join( '\n' );
	}



	replacements = [].concat(
		imports.map( clear ),

		exports.map( function ( x ) {
			var content;

			if ( x.declaration ) {
				content = x.value + '\n' + 'exports.' + x.name + ' = ' + x.name + ';';
			}

			else if ( x.specifiers ) {
				if ( options.defaultOnly ) {
					throw new Error( 'Named exports used in defaultOnly mode' );
				}

				content = x.specifiers.map( function ( specifier ) {
					return 'exports.' + specifier.name + ' = ' + specifier.name + ';';
				}).join( '\n' );
			}

			else {
				content = ( singleFinalExport ? 'module.exports' : ( options.defaultOnly ? '__export' : 'exports.' + x.name ) ) + ' = ' + x.value + ';';
			}

			return {
				start: x.start,
				end: x.end,
				//content: ( singleFinalExport ? 'return ' : options.defaultOnly ? '__export = ' : 'exports.' + x.name + ' = ' ) + x.value + ';'
				content: content
			};
		})
	);

	if ( options.defaultOnly && !singleFinalExport && exports.length ) {
		code = 'var __export;\n\n';
	}

	code += replaceChunks( this.source, replacements );

	if ( options.defaultOnly && !singleFinalExport && exports.length ) {
		code += 'module.exports = __export;';
	}

	return intro + code.trim() + outro;

	function getImportName ( x, i ) {
		if ( x.specifiers[0] && x.specifiers[0].batch ) {
			return x.specifiers[0].name;
		}

		return ( options.defaultOnly && x.specifiers[0] ) ? x.specifiers[0].as : '__imports_' + i;
	}
}

function clear ( x ) {
	return {
		start: x.start,
		end: x.end,
		content: ''
	};
}

function excludeBatchImports ( x ) {
	if ( x.specifiers[0] && x.specifiers[0].batch ) {
		return false;
	}

	return true;
}
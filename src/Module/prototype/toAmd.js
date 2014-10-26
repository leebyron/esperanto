import guessIndent from '../../utils/guessIndent';
import applyIndent from '../../utils/applyIndent';
import replaceChunks from '../helpers/replaceChunks';

export default function Module$toAmd ( options ) {
	var intro,
		outro,
		code = '',
		imports = this.imports.slice(),
		hasExports = !!this.exports.length,
		importPaths = '',
		importNames = '',
		indent,
		replacements,
		singleFinalExport;

	// We might be able to just return the exported value, rather
	// than assigning it to __exports to return later
	singleFinalExport = options.defaultOnly &&
		this.exports.length === 1 &&
		this.exports[0].node === this.ast.body[ this.ast.body.length - 1 ];

	replacements = [].concat(
		imports.map( function ( x, i ) {
			var importName, variableDeclarations;

			if ( options.defaultOnly || x.specifiers[0] && x.specifiers[0].batch ) {
				return {
					start: x.start,
					end: x.end,
					content: ''
				};
			}

			importName = '__imports_' + i;
			variableDeclarations = x.specifiers.map( function ( specifier ) {
				return 'var ' + specifier.as + ' = ' + importName + '.' + specifier.name + ';';
			});

			return {
				start: x.start,
				end: x.end,
				content: variableDeclarations.join( '\n' )
			};
		}),

		this.exports.map( function ( x ) {
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
				content = ( singleFinalExport ? 'return ' : ( options.defaultOnly ? '__export' : 'exports.' + x.name ) + ' = ' ) + x.value + ';';
			}

			return {
				start: x.start,
				end: x.end,
				//content: ( singleFinalExport ? 'return ' : options.defaultOnly ? '__export = ' : 'exports.' + x.name + ' = ' ) + x.value + ';'
				content: content
			};
		})
	);

	if ( imports.length || hasExports && !options.defaultOnly ) {
		importPaths = '[' +
			( options.defaultOnly || !hasExports ?
				imports.map( getPath ) :
				[ 'exports' ].concat( imports.map( getPath ) )
			).map( quote ).join( ',' ) +
		'],';

		// Remove empty imports from the end of the array
		while ( imports.length && !imports[ imports.length - 1 ].specifiers.length ) {
			imports.pop();
		}

		importNames = (
			options.defaultOnly || !hasExports ?
				imports.map( getImportName ) :
				[ 'exports' ].concat( imports.map( getImportName ) )
		).join( ', ' );
	}

	intro = 'define(' + importPaths + 'function (' + importNames + ') {';

	if ( options.addUseStrict !== false ) {
		code = "'use" + " strict';\n\n";
	}

	if ( !singleFinalExport && options.defaultOnly && hasExports ) {
		code += 'var __export;\n\n';
	}

	code += replaceChunks( this.source, replacements ).trim();

	if ( !singleFinalExport && options.defaultOnly && hasExports ) {
		code += '\nreturn __export;';
	}

	outro = '});';

	indent = options.indent || guessIndent( this.source );
	return [ intro, applyIndent( code.trim(), indent ), outro ].join( '\n\n' );

	function getImportName ( x, i ) {
		if ( x.specifiers[0] && x.specifiers[0].batch ) {
			return x.specifiers[0].name;
		}

		return ( options.defaultOnly && x.specifiers[0] ) ? x.specifiers[0].as : '__imports_' + i;
	}
}

function quote ( str ) {
	return "'" + str + "'";
}

function getPath ( x ) {
	return x.path;
}


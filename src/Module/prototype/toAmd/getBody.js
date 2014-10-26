import guessIndent from '../../../utils/guessIndent';
import applyIndent from '../../../utils/applyIndent';
import replaceChunks from '../../helpers/replaceChunks';

export default function ( module, options ) {
	var code = '',
		imports = module.imports.slice(),
		hasExports = !!module.exports.length,
		indent,
		replacements,
		trailingExport;

	// We might be able to just return the exported value, rather
	// than assigning it to __exports to return later
	trailingExport = options.defaultOnly &&
		module.exports.length === 1 &&
		module.exports[0].node === module.ast.body[ module.ast.body.length - 1 ];

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

		module.exports.map( function ( x ) {
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
				content = ( trailingExport ? 'return ' : ( options.defaultOnly ? '__export' : 'exports.' + x.name ) + ' = ' ) + x.value + ';';
			}

			return {
				start: x.start,
				end: x.end,
				content: content
			};
		})
	);

	if ( options.addUseStrict !== false ) {
		code = "'use" + " strict';\n\n";
	}

	if ( !trailingExport && options.defaultOnly && hasExports ) {
		code += 'var __export;\n\n';
	}

	code += replaceChunks( module.source, replacements ).trim();

	if ( !trailingExport && options.defaultOnly && hasExports ) {
		code += '\nreturn __export;';
	}

	indent = options.indent || guessIndent( module.source );
	return applyIndent( code.trim(), indent );
}
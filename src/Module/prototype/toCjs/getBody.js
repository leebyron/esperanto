import replaceChunks from '../../helpers/replaceChunks';

export default function ( module, options ) {
	var trailingExport,
		replacements,
		code = '';

	// We might be able to just export the default value, rather
	// than assigning it to __exports
	trailingExport = options.defaultOnly &&
		module.exports.length === 1 &&
		module.exports[0].node === module.ast.body[ module.ast.body.length - 1 ];

	replacements = [].concat(
		module.imports.map( clear ),

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
				content = ( trailingExport ? 'module.exports' : ( options.defaultOnly ? '__export' : 'exports.' + x.name ) ) + ' = ' + x.value + ';';
			}

			return {
				start: x.start,
				end: x.end,
				//content: ( trailingExport ? 'return ' : options.defaultOnly ? '__export = ' : 'exports.' + x.name + ' = ' ) + x.value + ';'
				content: content
			};
		})
	);

	if ( options.defaultOnly && !trailingExport && exports.length ) {
		code = 'var __export;\n\n';
	}

	code += replaceChunks( module.source, replacements );

	if ( options.defaultOnly && !trailingExport && exports.length ) {
		code += 'module.exports = __export;';
	}

	return code.trim();
}

function clear ( x ) {
	return {
		start: x.start,
		end: x.end,
		content: ''
	};
}
export default function ( module, options ) {
	var intro,
		importPaths = [],
		importNames = [];

	module.imports.forEach( function ( x, i ) {
		var name;

		// Empty imports (e.g. `import 'polyfills'`) have no name
		if ( !x.specifiers.length ) {
			name = '__imports_' + i;
		}

		// If this is a batch import, like `import * as fs from 'fs'`,
		// we can just use the batch name
		else if ( x.specifiers[0].batch ) {
			name = x.specifiers[0].name;
		}

		else {
			// Throw error if we're using named imports in defaultOnly mode
			if ( options.defaultOnly ) {
				if ( x.specifiers.length > 1 || !x.specifiers[0].default ) {
					throw new Error( 'Named import used in defaultOnly mode' );
				}
			}

			name = ( options.defaultOnly && x.specifiers[0] ) ? x.specifiers[0].as : '__imports_' + i;
		}

		importPaths[i] = x.path;

		// exclude empty imports, e.g. `import 'polyfills'`
		if ( !x.specifiers.length && ( i === module.imports.length - 1 ) ) {
			// don't include
		} else {
			importNames[i] = name;
		}
	});

	// Add `exports`, if we need to use it
	if ( module.exports.length && !options.defaultOnly ) {
		importPaths.unshift( 'exports' );
		importNames.unshift( 'exports' );
	}

	intro = [
		'define(',
		( importPaths.length ? '[' + importPaths.map( quote ) + '],' : '' ),
		'function (',
		importNames.join( ', ' ),
		') {'
	].join( '' );

	return intro + '\n\n';
}

function quote ( str ) {
	return "'" + str + "'";
}
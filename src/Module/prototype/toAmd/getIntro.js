var template = 'define(__IMPORT_PATHS__function (__IMPORT_NAMES__) {\n\n';

export default function getIntro ( mod, options ) {
	var importPaths = [],
		importNames = [];

	mod.imports.forEach( function ( x, i ) {
		var name;

		// Empty imports (e.g. `import 'polyfills'`) have no name
		if ( !x.specifiers.length ) {
			name = x.name;
		}

		// If this is a batch import, like `import * as fs from 'fs'`,
		// we can just use the batch name
		else if ( x.specifiers[0].batch ) {
			name = x.specifiers[0].name;
		}

		else {
			name = ( options.defaultOnly && x.specifiers[0] ) ? x.specifiers[0].as : x.name;
		}

		importPaths[i] = x.path;

		// exclude empty imports, e.g. `import 'polyfills'`
		if ( !x.specifiers.length && ( i === mod.imports.length - 1 ) ) {
			// don't include
		} else {
			importNames[i] = name;
		}
	});

	// Add `exports`, if we need to use it
	if ( mod.exports.length && !options.defaultOnly ) {
		importPaths.unshift( 'exports' );
		importNames.unshift( 'exports' );
	}

	return template
		.replace( '__IMPORT_PATHS__', importPaths.length ? '[' + importPaths.map( quote ) + '],' : '' )
		.replace( '__IMPORT_NAMES__', importNames.join( ', ' ) );
}

function quote ( str ) {
	return "'" + str + "'";
}

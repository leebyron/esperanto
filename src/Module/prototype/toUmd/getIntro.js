var template = `(function (global, factory) {

	'use strict';

	if (typeof define === 'function' && define.amd) {
		// export as AMD
		define([__AMD_DEPS__], factory);
	} else if ( typeof module !== 'undefined' && module.exports && typeof require === 'function' ) {
		// node/browserify
		module.exports = factory(__REQUIRE_DEPS__);
	} else {
		// browser global
		global.__NAME__ = factory(__GLOBAL_DEPS__);
	}

}(typeof window !== 'undefined' ? window : this, function (__IMPORTS__) {`;

export default function ( module, options ) {
	var intro,
		importPaths = [],
		importNames = [];

	module.imports.forEach( function ( x, i ) {
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
			// Throw error if we're using named imports in defaultOnly mode
			if ( options.defaultOnly ) {
				if ( x.specifiers.length > 1 || !x.specifiers[0].default ) {
					throw new Error( 'Named import used in defaultOnly mode' );
				}
			}

			name = ( options.defaultOnly && x.specifiers[0] ) ? x.specifiers[0].as : x.name;
		}

		importPaths[i] = x.path;

		// exclude empty imports, e.g. `import 'polyfills'`
		if ( !x.specifiers.length && ( i === module.imports.length - 1 ) ) {
			// don't include
		} else {
			importNames[i] = name;
		}
	});

	intro = template
		.replace( '__AMD_DEPS__',     importPaths.map( quote ).join( ', ' ) )
		.replace( '__REQUIRE_DEPS__', importPaths.map( path => `require('${path}')` ).join( ', ' ) )
		.replace( '__GLOBAL_DEPS__',  importNames.map( name => `global.${name}` ).join( ', ' ) ) // TODO this won't work with __imports_0 etc...
		.replace( '__IMPORTS__',      importNames.join( ', ' ) )
		.replace( '__NAME__', options.name );

	return intro + '\n\n';
}

function quote ( str ) {
	return "'" + str + "'";
}

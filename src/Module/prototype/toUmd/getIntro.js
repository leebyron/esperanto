var defaultOnlyTemplate = `(function (global, factory) {

	'use strict';

	if (typeof define === 'function' && define.amd) {
		// export as AMD
		define([__AMD_DEPS__], factory);
	} else if ( typeof module !== 'undefined' && module.exports && typeof require === 'function' ) {
		// node/browserify
		module.exports = factory(__CJS_DEPS__);
	} else {
		// browser global
		global.__NAME__ = factory(__GLOBAL_DEPS__);
	}

}(typeof window !== 'undefined' ? window : this, function (__IMPORTS__) {`;

var namedTemplate = `(function (global, factory) {

	'use strict';

	if (typeof define === 'function' && define.amd) {
		// export as AMD
		define([__AMD_DEPS__], factory);
	} else if ( typeof module !== 'undefined' && module.exports && typeof require === 'function' ) {
		// node/browserify
		factory(__CJS_DEPS__);
	} else {
		// browser global
		global.__NAME__ = {};
		factory(__GLOBAL_DEPS__);
	}

}(typeof window !== 'undefined' ? window : this, function (__IMPORTS__) {`;

export default function ( mod, options ) {
	var template,
		intro,
		importPaths = [],
		importNames = [],
		deps = {},
		imports;

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

	if ( options.defaultOnly || !mod.exports.length ) {
		template = defaultOnlyTemplate;

		deps.global = importNames.map( name => `global.${name}` ).join( ', ' );
		deps.cjs = importPaths.map( req ).join( ', ' );
	}

	else {
		template = namedTemplate;

		deps.global = [ options.name ].concat( importNames ).map( name => `global.${name}` ).join( ', ' );
		deps.cjs = [ 'exports' ].concat( importPaths.map( req ) ).join( ', ' );

		importPaths.unshift( 'exports' );
		importNames.unshift( 'exports' );
	}

	deps.amd = importPaths.map( quote ).join( ', ' );

	intro = template
		.replace( '__AMD_DEPS__',    deps.amd )
		.replace( '__CJS_DEPS__',    deps.cjs )
		.replace( '__GLOBAL_DEPS__', deps.global ) // TODO this won't work with __imports_0 etc...
		.replace( '__IMPORTS__',     importNames.join( ', ' ) )
		.replace( '__NAME__',        options.name );

	return intro + '\n\n';
}

function quote ( str ) {
	return "'" + str + "'";
}

function req ( path ) {
	return `require('${path}')`;
}

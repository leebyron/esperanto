import replaceReferences from '../../../utils/replaceReferences';
import getExportBlock from '../shared/getExportBlock';

var introWithExports, introWithoutExports;

introWithExports = `(function (global, factory) {

	'use strict';

	if (typeof define === 'function' && define.amd) {
		// export as AMD
		define(__AMD_DEPS__exporter);
	} else if (typeof module !== 'undefined' && module.exports && typeof require === 'function') {
		// node/browserify
		module.exports = exporter(__CJS_DEPS__);
	} else {
		// browser global
		global.__NAME__ = {};
		exporter(__GLOBAL_DEPS__);
	}

	function exporter (__EXPORTER_ARGS__) {
		exports.default = factory.call( global, function (get, prop) {
			Object.defineProperty(exports, prop, {
				enumerable: true,
				get: get,
				set: function () {
					throw new Error('Cannot reassign imported binding of namespace \`' + prop + '\`');
				}
			});
		}__PREFIXED_IMPORT_NAMES__);
	}

}(typeof window !== 'undefined' ? window : this, function (__IMPORT_NAMES__) {

	'use strict';

`;

introWithoutExports = `(function (global, factory) {

	'use strict';

	if (typeof define === 'function' && define.amd) {
		// export as AMD
		define(__AMD_DEPS__factory);
	} else if (typeof module !== 'undefined' && module.exports && typeof require === 'function') {
		// node/browserify
		factory(__CJS_DEPS__);
	} else {
		// browser global
		global.__NAME__ = {};
		factory(__GLOBAL_DEPS__);
	}

}(typeof window !== 'undefined' ? window : this, function (__IMPORT_NAMES__) {

	'use strict';

`;

export default function strict ( mod, body, options ) {
	var importPaths = [],
		importNames = [],
		globalNames,
		cjsDeps,
		exportDeclaration,
		exportedValue,
		intro,
		defaultValue,
		hasNonDefaultExports,
		importBlock,
		exportBlock,
		header,
		footer,
		i;

	replaceReferences( mod, body );

	// ensure empty imports are at the end
	i = mod.imports.length;
	while ( i-- ) {
		if ( !mod.imports[i].specifiers.length ) {
			mod.imports.splice( mod.imports.length - 1, 0, mod.imports.splice( i, 1 )[0] );
		}
	}

	// gather imports, and remove import declarations
	mod.imports.forEach( ( x, i ) => {
		importPaths[i] = x.path;

		if ( x.specifiers.length ) {
			importNames[i] = x.name;
		}

		body.remove( x.start, x.next );
	});

	// ...and export statements (but keep declarations)
	mod.exports.forEach( x => {
		var name;

		if ( x.default ) {
			defaultValue = body.slice( x.valueStart, x.end );
			if ( x.node.declaration && x.node.declaration.id && ( name = x.node.declaration.id.name ) ) {
				// if you have a default export like
				//
				//     export default function foo () {...}
				//
				// you need to rewrite it as
				//
				//     function foo () {...}
				//     exports.default = foo;
				//
				// as the `foo` reference may be used elsewhere
				body.replace( x.start, x.end, defaultValue + '\nexports.default = ' + name + ';' );
			} else {
				body.replace( x.start, x.end, 'exports.default = ' + defaultValue );
			}

			return;
		}

		hasNonDefaultExports = true;

		if ( x.declaration ) {
			body.remove( x.start, x.valueStart );
		} else {
			body.remove( x.start, x.next );
		}
	});

	body.trim();

	if ( hasNonDefaultExports ) {
		exportBlock = getExportBlock( mod );

		body.append( '\n\n' + exportBlock );

		intro = introWithExports
			.replace( '__AMD_DEPS__', importPaths.length ? '[' + importPaths.map( quote ).join( ', ' ) + '], ' : '' )
			.replace( '__CJS_DEPS__', importPaths.map( req ).join( ', ' ) )
			.replace( '__GLOBAL_DEPS__', importNames.map( globalify ).join( ', ' ) )
			.replace( '__IMPORT_NAMES__', [ '__export' ].concat( importNames ).join( ', ' ) )
			.replace( '__PREFIXED_IMPORT_NAMES__', importNames.map( x => ', ' + x ).join( '' ) )
			.replace( '__EXPORTER_ARGS__', [ 'exports' ].concat( importNames ).join( ', ' ) )
			.replace( '__NAME__', options.name )
			.replace( /\t/g, body.indentStr );


	} else {
		if ( mod.exports.length ) {
			// we have a default export
			globalNames = [ `global.${options.name}` ].concat( importNames.map( globalify ) );
			cjsDeps = [ 'exports' ].concat( importPaths.map( req ) );

			importPaths.unshift( 'exports' );
			importNames.unshift( 'exports' );
		} else {
			globalNames = importNames.map( globalify );
			cjsDeps = importPaths.map( req );
		}

		intro = introWithoutExports
			.replace( '__AMD_DEPS__', importPaths.length ? '[' + importPaths.map( quote ).join( ', ' ) + '], ' : '' )
			.replace( '__CJS_DEPS__', cjsDeps.join( ', ' ) )
			.replace( '__GLOBAL_DEPS__', globalNames.join( ',  ' ) )
			.replace( '__IMPORT_NAMES__', importNames.join( ', ' ) )
			.replace( '__NAME__', options.name )
			.replace( /\t/g, body.indentStr );
	}

	body.trim().indent().prepend( intro ).append( '\n\n}));' );

	return body.toString();
}

function isFunctionDeclaration ( x ) {
	return x.node.declaration && x.node.declaration.type === 'FunctionExpression';
}

function quote ( str ) {
	return "'" + str + "'";
}

function req ( path ) {
	return `require('${path}')`;
}

function globalify ( name ) {
	return `global.${name}`;
}
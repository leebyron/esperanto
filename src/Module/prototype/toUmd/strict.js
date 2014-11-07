import replaceReferences from '../../../utils/replaceReferences';
import getExportBlock from '../shared/getExportBlock';
import template from '../../../utils/template';

var introWithExports, introWithoutExports;

introWithExports = template( `(function (global, factory) {

	'use strict';

	if (typeof define === 'function' && define.amd) {
		// export as AMD
		define([<%= AMD_DEPS %>], exporter);
	} else if (typeof module !== 'undefined' && module.exports && typeof require === 'function') {
		// node/browserify
		exporter(<%= CJS_DEPS %>);
	} else {
		// browser global
		global.<%= NAME %> = {};
		exporter(<%= GLOBAL_DEPS %>);
	}

	function exporter (<%= EXPORTER_ARGS %>) {
		exports.default = factory.call(global, function (prop, get) {
			Object.defineProperty(exports, prop, {
				enumerable: true,
				get: get,
				set: function () {
					throw new Error('Cannot reassign imported binding of namespace \u0060' + prop + '\u0060');
				}
			});
		}<%= PREFIXED_IMPORT_NAMES %>);
	}

}(typeof window !== 'undefined' ? window : this, function (<%= IMPORT_NAMES %>) {

	'use strict';

` );

introWithoutExports = template( `(function (global, factory) {

	'use strict';

	if (typeof define === 'function' && define.amd) {
		// export as AMD
		define(<%= AMD_DEPS %>factory);
	} else if (typeof module !== 'undefined' && module.exports && typeof require === 'function') {
		// node/browserify
		factory(<%= CJS_DEPS %>);
	} else {
		// browser global
		global.<%= NAME %> = {};
		factory(<%= GLOBAL_DEPS %>);
	}

}(typeof window !== 'undefined' ? window : this, function (<%= IMPORT_NAMES %>) {

	'use strict';

` );

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

		intro = introWithExports({
			AMD_DEPS: [ 'exports' ].concat( importPaths ).map( quote ).join( ', ' ),
			CJS_DEPS: [ 'exports' ].concat( importPaths.map( req ) ).join( ', ' ),
			GLOBAL_DEPS: [ `global.${options.name}` ].concat( importNames.map( globalify ) ).join( ', ' ),
			IMPORT_NAMES: [ '__export' ].concat( importNames ).join( ', ' ),
			PREFIXED_IMPORT_NAMES: importNames.map( x => ', ' + x ).join( '' ),
			EXPORTER_ARGS: [ 'exports' ].concat( importNames ).join( ', ' ),
			NAME: options.name
		}).replace( /\t/g, body.indentStr );


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

		intro = introWithoutExports({
			AMD_DEPS: importPaths.length ? '[' + importPaths.map( quote ).join( ', ' ) + '], ' : '',
			CJS_DEPS: cjsDeps.join( ', ' ),
			GLOBAL_DEPS: globalNames.join( ',  ' ),
			IMPORT_NAMES: importNames.join( ', ' ),
			NAME: options.name
		}).replace( /\t/g, body.indentStr );
	}

	body.trim().indent().prepend( intro ).trim().append( '\n\n}));' );

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

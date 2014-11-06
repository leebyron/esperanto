import replaceReferences from '../../../utils/replaceReferences';
import getExportBlock from '../shared/getExportBlock';
import template from '../../../utils/template';

var introTemplate, outroWithExports;

introTemplate = template( `define(<%= AMD_DEPS %>function (<%= IMPORT_NAMES %>) {

` );

outroWithExports = `

	function __export(prop, get) {
		Object.defineProperty(exports, prop, {
			enumerable: true,
			get: get,
			set: function () {
				throw new Error('Cannot reassign imported binding of namespace \u0060' + prop + '\u0060');
			}
		});
	}

});`;

export default function strict ( mod, body, options ) {
	var importPaths = [],
		importNames = [],
		globalNames,
		cjsDeps,
		exportDeclaration,
		exportedValue,
		intro,
		outro,
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

	if ( mod.exports.length ) {
		importPaths.unshift( 'exports' );
		importNames.unshift( 'exports' );
	}

	if ( hasNonDefaultExports ) {
		exportBlock = getExportBlock( mod );
		body.append( '\n\n' + exportBlock );
		outro = outroWithExports;
	} else {
		outro = '\n\n});';
	}

	intro = introTemplate({
		AMD_DEPS: importPaths.length ? '[' + importPaths.map( quote ).join( ', ' ) + '], ' : '',
		IMPORT_NAMES: importNames.join( ', ' )
	}).replace( /\t/g, body.indentStr );

	body.trim().indent().prepend( intro ).append( outro );

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
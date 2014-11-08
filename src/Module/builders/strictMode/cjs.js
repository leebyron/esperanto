import getExportBlock from './utils/getExportBlock';

var outroWithExports = `

}).call(global, function(prop, get) {

	Object.defineProperty(exports, prop, {
		enumerable: true,
		get: get,
		set: function () {}
	});

});`;

export default function strict ( mod, body, options ) {
	var intro,
		defaultValue,
		hasNonDefaultExports,
		importBlock,
		exportBlock,
		header,
		footer;

	intro = mod.imports.map( x => {
		var name, lhs, rhs;

		rhs = `require('${x.path}');`;

		if ( x.specifiers.length ) {
			if ( x.specifiers[0] && x.specifiers[0].batch ) {
				name = x.specifiers[0].name;
			} else {
				name = x.name;
			}

			lhs = `var ${name} = `;

			return lhs + rhs;
		}

		return rhs;
	}).join( '\n' );

	// remove import statements...
	mod.imports.forEach( x => {
		if ( !x.passthrough ) { // this is actually a chained export statement, e.g. `export { foo } from 'foo'`
			body.remove( x.start, x.next );
		}
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

	// Create block of require statements
	importBlock = mod.imports.map( x => {
		var specifier, name, replacement;

		specifier = x.specifiers[0];

		if ( !specifier ) {
			// empty import
			replacement = `require('${x.path}');`;
		} else {
			name = specifier.batch ? specifier.name : x.name;
			replacement = `var ${name} = require('${x.path}');`;
		}

		return replacement;
	}).join( '\n' );

	// ...and a block of export statements
	exportBlock = getExportBlock( mod, options, 'module.exports = ', defaultValue );

	body.trim()
		.prepend( importBlock ? ( importBlock + '\n\n' ) : '' )
		.prepend( exportBlock ? ( exportBlock + '\n\n' ) : '' )
		.prepend( "'use strict';\n\n" ).trim()
		.indent();

	if ( hasNonDefaultExports ) {
		body.prepend( '(function (__export) {\n\n' )
			.append( outroWithExports.replace( /\t/g, mod.body.indentStr ) );
	} else {
		body.prepend( '(function () {\n\n' )
			.append( '\n\n}).call(global);' );
	}

	return body.toString();
}

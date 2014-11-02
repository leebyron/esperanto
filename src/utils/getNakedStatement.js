export default function getNakedStatement ( mod, body, options ) {
	var ast, i, len, node, exported, declarations, declarator;

	// This only works in defaultOnly mode
	if ( !options.defaultOnly ) {
		return null;
	}

	// If this module has imports, it's difficult to
	// treat it as a naked statement
	if ( mod.imports.length ) {
		return null;
	}

	// Ditto more than one export, as exports may use
	// references for each other, which would break
	if ( mod.exports.length > 1 ) {
		return null;
	}

	ast = mod.ast.body;
	declarations = ast.filter( isDeclaration );

	// Case 1: no exports, no declarations
	if ( !mod.exports.length ) {
		if ( !declarations.length ) {
			return body.toString();
		}

		return null;
	}

	exported = mod.exports[0];

	// Case 2: export default function declaration
	if ( exported.declaration ) {
		if ( declarations.length ) {
			// There are other declarations, need to wrap in IIFE
			return null;
		}

		// Rename identifier
		console.log( 'exported.declaration', exported.declaration );
		throw new Error( 'TODO' );
	}

	// Case 3: exporting a reference
	if ( exported.node.declaration.type === 'Identifier' ) {
		// if the only other declaration in the body is to set
		// up this export, we just use that declaration (but rename
		// the identifier if necessary)
		if ( declarations.length !== 1 ) {
			return null;
		}

		if ( !declarations[0].declarations || declarations[0].declarations.length !== 1 ) {
			return null;
		}

		declarator = declarations[0].declarations[0];
		if ( declarator.id.name !== exported.value ) {
			return null;
		}

		// Remove the export, and rename the identifier if necessary
		body.remove( exported.start, exported.next );
		body.replace( declarator.id.start, declarator.id.end, options.name );

		return body.toString();
	}

	// Case 4: exporting a literal value
	if ( exported.node.declaration.type === 'Literal' ) {
		if ( declarations.length ) {
			return null;
		}

		body.replace( exported.start, exported.next, 'var ' + options.name + ' = ' + exported.value );
		return body.toString();
	}

	return null;
}

// var, let, const, function declarations
function isDeclaration ( node ) {
	return /Declaration$/.test( node.type ) && node.type !== 'ExportDeclaration';
}
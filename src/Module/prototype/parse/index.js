import processImport from './processImport';
import processExport from './processExport';

export default function Module$parse ( options ) {
	var source = this.source,
		imports = this.imports,
		exports = this.exports,
		previousDeclaration,
		uid = 0;

	this.ast.body.forEach( function ( node ) {
		var declaration, name;

		if ( previousDeclaration ) {
			previousDeclaration.next = node.start;

			if ( node.type !== 'EmptyStatement' ) {
				previousDeclaration = null;
			}
		}

		if ( node.type === 'ImportDeclaration' ) {
			declaration = processImport( node, source );

			// give each imported module a name, falling back to
			// __imports_x
			if ( options.getModuleName ) {
				name = options.getModuleName( declaration.path );
			}

			declaration.name = name ? sanitize( name ) : '__imports_' + uid++;

			imports.push( declaration );
		}

		else if ( node.type === 'ExportDeclaration' ) {
			declaration = processExport( node, source );
			exports.push( declaration );
		}

		if ( declaration ) {
			declaration.start = node.start;
			declaration.end = node.end;
			declaration.node = node;

			previousDeclaration = declaration;
		}
	});

	// catch any trailing semicolons
	if ( previousDeclaration ) {
		previousDeclaration.next = source.length;
	}
}

function sanitize ( name ) {
	name = name.replace( /[^a-zA-Z0-9_$]/g, '_' );
	if ( /[^a-zA-Z_$]/.test( name[0] ) ) {
		name = '_' + name;
	}

	return name;
}

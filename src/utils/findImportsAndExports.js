import resolve from './resolve';
import sanitize from './sanitize';

function processImport ( node, passthrough ) {
	return {
		path: node.source.value,
		specifiers: node.specifiers.map( s => {
			var id;

			if ( s.type === 'ImportBatchSpecifier' ) {
				return {
					batch: true,
					name: s.name.name
				};
			}

			id = s.id.name;

			return {
				default: !!s.default,
				name: s.default ? 'default' : id,
				as: s.name ? s.name.name : id
			};
		}),
		passthrough: !!passthrough
	};
}

function processExport ( node, source ) {
	var d, value;

	if ( d = node.declaration ) {
		value = source.slice( d.start, d.end );

		if ( /Declaration/.test( d.type ) ) {
			// inline declarations, e.g
			//
			//     export var foo = 'bar';
			//     export function baz () {...}
			return {
				declaration: true,
				default: !!node.default,
				name: node.default ? 'default' : getDeclarationName( d ),
				value: value,
				valueStart: d.start
			};
		}

		// literals, e.g. `export default 42`
		return {
			default: true,
			name: 'default',
			value: value,
			valueStart: d.start
		};
	}

	// named exports, e.g. `export { foo, bar };`
	return {
		specifiers: node.specifiers.map( s => ({ name: s.id.name }) )
	};
}

function getDeclarationName ( declaration ) {
	if ( declaration.type === 'VariableDeclaration' ) {
		return declaration.declarations[0].id.name;
	}

	if ( declaration.type === 'FunctionDeclaration' ) {
		return declaration.id.name;
	}
}

export default function findImportsAndExports ( mod, source, ast, imports, exports ) {
	var previousDeclaration,
		uid = 0;

	ast.body.forEach( node => {
		var passthrough, declaration, name;

		if ( previousDeclaration ) {
			previousDeclaration.next = node.start;

			if ( node.type !== 'EmptyStatement' ) {
				previousDeclaration = null;
			}
		}

		if ( node.type === 'ImportDeclaration' ) {
			declaration = processImport( node );
			imports.push( declaration );
		}

		else if ( node.type === 'ExportDeclaration' ) {
			declaration = processExport( node, source );
			exports.push( declaration );

			if ( declaration.default ) {
				if ( mod.defaultExport ) {
					throw new Error( 'Duplicate default exports' );
				}
				mod.defaultExport = declaration;
			}

			if ( node.source ) {
				// it's both an import and an export, e.g.
				// `export { foo } from './bar';
				passthrough = processImport( node, true );

				passthrough.node = node;
				passthrough.start = node.start;
				passthrough.end = node.end;
				imports.push( passthrough );

				declaration.passthrough = passthrough;
			}
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

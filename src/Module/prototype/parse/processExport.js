export default function processExport ( node, source ) {
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
				name: node.default ? 'default' : getDeclarationName( d ),
				value: value
			};
		}

		// literals, e.g. `export default 42`
		return {
			name:'default',
			value: value
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
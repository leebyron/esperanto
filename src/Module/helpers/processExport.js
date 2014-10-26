export default function processExport ( node, source ) {
	if ( node.declaration ) {
		if ( /Declaration/.test( node.declaration.type ) ) {
			return {
				declaration: true,
				name: node.default ? 'default' : getDeclarationName( node.declaration ),
				value: source.slice( node.declaration.start, node.declaration.end )
			};
		}

		return {
			name: node.default ? 'default' : node.declaration.name,
			//value: node.declaration.raw
			value: source.slice( node.declaration.start, node.declaration.end )
		};
	}

	return {
		specifiers: node.specifiers.map( function ( specifier ) {
			return {
				name: specifier.id.name
			};
		})
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
export default function processImport ( node ) {
	return {
		path: node.source.value,
		specifiers: node.specifiers.map( function ( specifier ) {
			var id;

			if ( specifier.type === 'ImportBatchSpecifier' ) {
				return {
					batch: true,
					name: specifier.name.name
				};
			}

			id = specifier.id.name;

			return {
				name: specifier.default ? 'default' : id,
				as: specifier.name ? specifier.name.name : id
			};
		})
	};
}
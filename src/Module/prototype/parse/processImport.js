export default function processImport ( node ) {
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
				name: s.default ? 'default' : id,
				as: s.name ? s.name.name : id
			};
		})
	};
}
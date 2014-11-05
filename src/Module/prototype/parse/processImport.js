export default function processImport ( node, passthrough ) {
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
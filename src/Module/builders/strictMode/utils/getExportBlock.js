export default function getExportBlock ( mod ) {
	var indent, passthroughByName;

	indent = mod.body.indentStr;

	passthroughByName = {};
	mod.imports.forEach( x => {
		x.specifiers.forEach( s => {
			passthroughByName[ s.as ] = x.name + '.' + s.name;
		});
	});

	// Otherwise, we export live bindings
	return mod.exports.map( x => {
		if ( x.default ) {
			return '';
		}

		if ( x.specifiers ) {
			return x.specifiers.map( s => {
				var passthrough;

				// if we have a situation like...
				//
				//     export { foo } from './bar';
				//
				// ...or...
				//
				//     import { foo } from './bar';
				//     export { foo }
				//
				// ...then we need to export `__bar.foo`, not `foo`
				if ( x.passthrough ) {
					passthrough = x.passthrough.name + '.' + s.name;
				} else {
					passthrough = passthroughByName[ s.name ];
				}

				return exporter( s.name, passthrough || s.name );
			}).join( '\n' );
		}

		if ( x.declaration ) {
			return exporter( x.name, x.name );
		}

		throw new Error( 'Unknown export type' );
	}).join( '\n' );

	function exporter ( name, value ) {
		return `__export('${name}', function () { return ${value}; });`;
	}
}

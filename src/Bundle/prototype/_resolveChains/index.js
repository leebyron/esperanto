import resolve from '../../../utils/resolve';

export default function Bundle$_resolveChains () {
	var chains = this._chains = {};

	// First pass - resolving intra-module chains
	this.modules.forEach( mod => {
		var origin = {}, namespaceExporter;

		mod.imports.forEach( x => {
			x.specifiers.forEach( s => {
				var modulePath = resolve( x.path, mod.path );

				if ( s.batch ) {
					// if this is an internal module, we need to tell that module that
					// it needs to export an object full of getters
					if ( namespaceExporter = this.moduleLookup[ modulePath ] ) {
						namespaceExporter._exportsNamespace = true;
					}

					return; // TODO can batch imports be chained?
				}

				origin[ s.as ] = modulePath + '@' + s.name;
			});
		});

		mod.exports.forEach( x => {
			if ( !x.specifiers ) return;

			x.specifiers.forEach( s => {
				var o = origin[ s.name ];

				if ( o ) {
					chains[ mod.file + '@' + s.name ] = o;
				}
			});
		});
	});
}
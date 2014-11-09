export default function gatherImports ( imports, externalModules, importedBindings, toRewrite ) {
	var replacements = {};

	imports.forEach( x => {
		var external;

		if ( ~externalModules.indexOf( x.path ) ) {
			external = true;
		}

		x.specifiers.forEach( s => {
			var name, replacement;

			if ( s.batch ) {
				name = replacement = s.name;
			} else {
				name = s.as;

				if ( !external || s.name === 'default' ) {
					replacement = x.name + '__' + s.name;
				} else {
					replacement = x.name + '.' + s.name;
				}
			}

			importedBindings[ name ] = replacement;

			if ( !x.passthrough ) {
				toRewrite[ name ] = replacement;
			}
		});
	});

	return replacements;
}

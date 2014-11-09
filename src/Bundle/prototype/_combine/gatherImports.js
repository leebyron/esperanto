export default function gatherImports ( imports, externalModules, importedBindings, toRewrite, chains ) {
	var replacements = {};

	imports.forEach( x => {
		var external;

		if ( ~externalModules.indexOf( x.path ) ) {
			external = true;
		}

		x.specifiers.forEach( s => {
			var moduleName, specifierName, name, replacement, hash, isChained, separatorIndex;

			if ( s.batch ) {
				name = s.name;
				replacement = x.name;
			} else {
				name = s.as;
				moduleName = x.name;
				specifierName = s.name;

				// If this is a chained import, get the origin
				hash = moduleName + '@' + specifierName;
				while ( chains[ hash ] ) {
					hash = chains[ hash ];
					isChained = true;
				}

				if ( isChained ) {
					separatorIndex = hash.indexOf( '@' );
					moduleName = hash.substr( 0, separatorIndex );
					specifierName = hash.substring( separatorIndex + 1 );
				}

				if ( !external || specifierName === 'default' ) {
					replacement = moduleName + '__' + specifierName;
				} else {
					replacement = moduleName + '.' + specifierName;
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

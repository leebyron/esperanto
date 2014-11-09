export default function gatherImports ( imports, importedBindings, toRewrite ) {
	imports.forEach( x => {
		x.specifiers.forEach( s => {
			var name, replacement;

			if ( s.batch ) {
				name = s.name;
			} else {
				name = s.as;
			}

			replacement = s.batch ? s.name : ( x.name + '.' + s.name );

			importedBindings[ name ] = replacement;

			if ( !x.passthrough ) {
				toRewrite[ name ] = replacement;
			}
		});
	});
}

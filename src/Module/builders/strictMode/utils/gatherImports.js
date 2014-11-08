export default function gatherImports ( imports, importedBindings, toRewrite ) {
	var replacements = {};

	imports.forEach( x => {
		/*if ( x.passthrough ) {
			// we have a case like `export { foo } from './bar'` -
			// we don't want `foo` to create a local binding
			return;
		}*/

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

	return replacements;
}

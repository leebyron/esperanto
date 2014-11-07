export default function getImportReplacements ( imports, options ) {
	var replacements = {}, joiner;

	joiner = ( options && options.joiner ) || '.';

	imports.forEach( x => {
		if ( x.passthrough ) {
			return;
		}

		x.specifiers.forEach( s => {
			var ref;

			if ( s.batch ) {
				ref = s.name;
			} else {
				ref = s.as;
			}

			replacements[ ref ] = s.batch ? s.name : ( x.name + joiner + s.name );
		});
	});

	return replacements;
}

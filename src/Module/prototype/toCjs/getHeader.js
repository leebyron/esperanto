export default function ( module, options ) {
	var importStatements;

	importStatements = module.imports.map( ( x, i ) => {
		var name, lhs, rhs;

		rhs = `require('${x.path}');`;

		if ( x.specifiers.length ) {
			if ( options.defaultOnly ) {
				name = ( x.specifiers[0].as || x.specifiers[0].name ); // TODO should only be one possibility, no?
			} else if ( x.specifiers[0] && x.specifiers[0].batch ) {
				name = x.specifiers[0].name;
			} else {
				name = x.name;
			}

			lhs = `var ${name} = `;

			return lhs + rhs;
		}

		return rhs;
	}).join( '\n' );

	return importStatements;
}

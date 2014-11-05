export default function getIntro ( module, options ) {
	return module.imports.map( x => {
		var name, lhs, rhs;

		rhs = `require('${x.path}');`;

		if ( x.specifiers.length ) {
			if ( x.specifiers[0] && x.specifiers[0].batch ) {
				name = x.specifiers[0].name;
			} else {
				name = x.name;
			}

			lhs = `var ${name} = `;

			return lhs + rhs;
		}

		return rhs;
	}).join( '\n' );
}

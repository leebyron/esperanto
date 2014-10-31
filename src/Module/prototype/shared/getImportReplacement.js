export default function getImportReplacement ( x, options ) {
	if ( options.defaultOnly || x.specifiers[0] && x.specifiers[0].batch ) {
		return '';
	}

	return x.specifiers.map( s => {
		if ( options.defaultOnly && !s.default ) {
			throw new Error( `Named import used in defaultOnly mode (${s.as})` );
		}

		return `var ${s.as} = ${x.name}.${s.name};\n`;
	}).join( '' );
}

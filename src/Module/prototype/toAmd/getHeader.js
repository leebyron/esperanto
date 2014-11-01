var USE_STRICT = "'use strict';";

export default function getHeader ( mod, options ) {
	var intro;

	if ( options.defaultOnly ) {
		intro = '';
	} else {
		intro = intro = mod.imports.filter( excludeBatchImports ).map( x => {
			return x.specifiers.map( s => {
				return `var ${s.as} = ${x.name}.${s.name};`;
			}).join( '\n' );
		}).join( '\n' );
	}

	if ( options.addUseStrict !== false ) {
		return intro ? USE_STRICT + '\n\n' + intro : USE_STRICT;
	}

	return intro;
}

function excludeBatchImports ( x ) {
	if ( x.specifiers[0] && x.specifiers[0].batch ) {
		return false;
	}

	return true;
}

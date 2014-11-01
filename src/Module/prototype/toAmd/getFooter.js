export default function getFooter ( mod, options ) {
	var x;

	if ( !mod.exports.length ) {
		return '';
	}

	// In default only mode, we just do e.g. `return foo`
	if ( options.defaultOnly ) {
		if ( mod.exports.length > 1 ) {
			throw new Error( 'Multiple exports used in defaultOnly mode' );
		}

		x = mod.exports[0];
		if ( !x.default ) {
			throw new Error( 'Named export used in defaultOnly mode' );
		}

		return 'return ' + x.value + ';';
	}

	// Otherwise, we assign to `exports`
	return mod.exports.map( x => {
		if ( x.specifiers ) {
			return x.specifiers.map( s => `exports.${s.name} = ${s.name};` ).join( '\n' );
		}

		if ( x.declaration ) {
			return `exports.${x.name} = ${x.name};`;
		}

		if ( x.default ) {
			return `exports.default = ${x.value};`;
		}

		throw new Error( 'Unknown export type' );
	}).join( '\n' );
}
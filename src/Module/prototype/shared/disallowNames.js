var importMessage = 'Named imports used in defaultOnly mode',
	exportMessage = 'Named exports used in defaultOnly mode';

export default function disallowNames ( mod ) {
	mod.imports.forEach( x => {
		if ( !x.specifiers.length ) {
			return; // ok
		}

		if ( x.specifiers.length > 1 ) {
			throw new Error( importMessage );
		}

		if ( !x.specifiers[0].default ) {
			throw new Error( importMessage );
		}
	});

	mod.exports.forEach( x => {
		if ( !x.default ) {
			throw new Error( exportMessage );
		}
	});
}
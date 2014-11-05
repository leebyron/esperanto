export default function removeImportsAndExports ( mod, body ) {
	mod.imports.forEach( x => body.remove( x.start, x.next ) );

	mod.exports.forEach( x => {
		if ( x.declaration ) {
			body.remove( x.start, x.valueStart );
		} else {
			body.remove( x.start, x.next );
		}
	});
}
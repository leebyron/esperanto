export default function getOutro ( mod, options ) {
	var node, importNames;

	// is this a one-liner?
	/*if ( node = oneLiner( mod ) ) {
		// TODO
		return;
	}*/

	if ( options.defaultOnly || !mod.exports.length ) {
		importNames = mod.imports.map( getName ).join( ', ' );
	} else {
		importNames = [ options.name ].concat( mod.imports.map( getName ) ).join( ', ' );
	}

	//return '}(' + importNames + '));';
	return '}());';
}


/*function oneLiner ( mod ) {
	return null; // TODO
}*/

function getName ( x ) {
	return x.name;
}
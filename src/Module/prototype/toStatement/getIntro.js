export default function getIntro ( mod, options ) {
	var node, importNames;

	// is this a one-liner?
	/*if ( node = oneLiner( mod ) ) {
		// TODO
		return;
	}*/

	if ( options.defaultOnly || !mod.exports.length ) {
		importNames = mod.imports.map( getName ).join( ', ' );
		//return ( mod.exports.length ? `var ${options.name} = ` : '' ) + `(function (${importNames}) {`;
		return ( mod.exports.length ? `var ${options.name} = ` : '' ) + `(function () {`;
	}

	importNames = [ 'exports' ].concat( mod.imports.map( getName ) ).join( ', ' );
	//return `var ${options.name} = {};\n(function (${importNames}) {`;
	return `var ${options.name} = {};\n(function () {`;
}


/*function oneLiner ( mod ) {
	return null; // TODO
}*/

function getName ( x ) {
	return x.name;
}
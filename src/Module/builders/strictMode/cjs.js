var intro = '(function () {\n\n\t\'use strict\';\n\n';

var outro = '\n\n}).call(global);';

export default function strict ( mod, body ) {
	var importBlock;

	// Create block of require statements
	importBlock = mod.imports.map( x => {
		var specifier, name, replacement;

		specifier = x.specifiers[0];

		if ( !specifier ) {
			// empty import
			replacement = `require('${x.path}');`;
		} else {
			name = specifier.batch ? specifier.name : x.name;
			replacement = `var ${name} = require('${x.path}');`;
		}

		return replacement;
	}).join( '\n' );

	body.trim()
		.prepend( importBlock ? ( importBlock + '\n\n' ) : '' )
		.indent();

	body.prepend( intro.replace( /\t/g, body.indentStr ) ).trim().append( outro );

	return body.toString();
}

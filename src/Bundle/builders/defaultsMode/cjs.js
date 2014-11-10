export default function cjs ( bundle, body ) {
	var importBlock,
		entry = bundle.entryModule,
		x,
		exportStatement,
		intro;

	importBlock = bundle.externalModules.map( x => {
		return `var ${x.name}__default = require('${x.path}');`;
	}).join( '\n' );

	if ( importBlock ) {
		body.prepend( importBlock + '\n\n' );
	}

	if ( x = entry.exports[0] ) {
		exportStatement = 'module.exports = ' + entry.name + '__default;';
		body.append( '\n\n' + exportStatement );
	}

	intro = '(function () {\n\n' + body.indentStr + "'use strict';\n\n";

	body.prepend( intro ).trim().append( '\n\n}).call(global);' );
	return body.toString();
}

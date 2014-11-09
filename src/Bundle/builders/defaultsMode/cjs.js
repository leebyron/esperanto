export default function cjs ( bundle, body ) {
	var importBlock,
		entry = bundle.entryModule,
		x,
		exportStatement,
		intro;

	importBlock = bundle.externalModules.map( x => {
		return `var ${x}__default = require('${x}');`;
	}).join( '\n' );

	if ( importBlock ) {
		body.prepend( importBlock + '\n\n' );
	}

	if ( x = entry.exports[0] ) {
		exportStatement = 'module.exports = ' + bundle.getModuleName( entry.file ) + '__default;';
		body.append( '\n\n' + exportStatement );
	}

	intro = '(function () {\n\n' + body.indentStr + "'use strict';\n\n";

	body.indent().prepend( intro ).trim().append( '\n\n}).call(global);' );
	return body.toString();
}

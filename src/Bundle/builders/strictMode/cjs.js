import getExportBlock from './utils/getExportBlock';

export default function cjs ( bundle, body ) {
	var importBlock,
		entry = bundle.entryModule,
		exportBlock,
		intro;

	importBlock = bundle.externalModules.map( x => {
		return `var ${x} = require('${x}');\nvar ${x}__default = ('default' in ${x} ? ${x}.default : ${x});`;
	}).join( '\n' );

	if ( importBlock ) {
		body.prepend( importBlock + '\n\n' );
	}

	if ( entry.exports.length ) {
		exportBlock = getExportBlock( entry, body.indentStr );
		body.append( '\n\n' + exportBlock );
	}

	intro = '(function () {\n\n' + body.indentStr + "'use strict';\n\n";

	body.indent().prepend( intro ).trim().append( '\n\n}).call(global);' );
	return body.toString();
}

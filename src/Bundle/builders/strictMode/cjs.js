import getExportBlock from './utils/getExportBlock';

export default function cjs ( bundle, body ) {
	var importBlock,
		entry = bundle.entryModule,
		exportBlock,
		intro;

	importBlock = bundle.externalModules.map( x => {
		return `var ${x.name} = require('${x.path}');\nvar ${x.name}__default = ('default' in ${x.name} ? ${x.name}.default : ${x.name});`;
	}).join( '\n' );

	if ( importBlock ) {
		body.prepend( importBlock + '\n\n' );
	}

	if ( entry.exports.length ) {
		exportBlock = getExportBlock( entry, body.indentStr );
		body.append( '\n\n' + exportBlock );
	}

	intro = '(function () {\n\n' + body.indentStr + "'use strict';\n\n";

	body.prepend( intro ).trim().append( '\n\n}).call(global);' );
	return body.toString();
}

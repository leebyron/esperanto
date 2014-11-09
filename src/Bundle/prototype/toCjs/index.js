import MagicString from 'magic-string';
import getUmdIntro from '../../../utils/getUmdIntro';

export default function Bundle$toCjs ( options ) {
	var body,
		importBlock,
		intro,
		outro;

	body = this.body.clone();

	importBlock = this.externalModules.map( x => {
		return `var ${x} = require('${x}');\nvar ${x}__default = ('default' in ${x} ? ${x}.default : ${x});`;
	}).join( '\n' );

	if ( importBlock ) {
		body.prepend( importBlock + '\n\n' );
	}

	intro = '(function () {\n\n' + body.indentStr + "'use strict';\n\n";

	body.indent().prepend( intro ).trim().append( '\n\n}).call(global);' );
	return body.toString();
}

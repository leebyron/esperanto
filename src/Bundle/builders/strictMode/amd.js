import template from '../../../utils/template';
import getExportBlock from './utils/getExportBlock';

var introTemplate;

export default function amd ( bundle, body ) {
	var defaultsBlock,
		entry = bundle.entryModule,
		exportBlock,
		externalModules,
		intro;

	defaultsBlock = bundle.externalModules.map( x => {
		return `var ${x}__default = ('default' in ${x} ? ${x}.default : ${x});`;
	}).join( '\n' );

	if ( defaultsBlock ) {
		body.prepend( defaultsBlock + '\n\n' );
	}

	if ( entry.exports.length ) {
		externalModules = [ 'exports' ].concat( bundle.externalModules );

		exportBlock = getExportBlock( entry, body.indentStr );
		body.append( '\n\n' + exportBlock );
	} else {
		externalModules = bundle.externalModules;
	}

	intro = introTemplate({
		amdDeps: externalModules.length ? '[' + externalModules.map( quote ).join( ', ' ) + '], ' : '',
		names: externalModules.join( ', ' )
	}).replace( /\t/g, body.indentStr );

	body.indent().prepend( intro ).trim().append( '\n\n});' );
	return body.toString();
}

function quote ( str ) {
	return "'" + str + "'";
}

introTemplate = template( 'define(<%= amdDeps %>function (<%= names %>) {\n\n\t\'use strict\';\n\n' );
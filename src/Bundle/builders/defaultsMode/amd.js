import template from '../../../utils/template';

var introTemplate = template( 'define(<%= amdDeps %>function (<%= names %>) {\n\n\t\'use strict\';\n\n' );

export default function amd ( bundle, body ) {
	var entry = bundle.entryModule,
		x,
		exportStatement,
		intro;

	if ( x = entry.exports[0] ) {
		exportStatement = 'return ' + bundle.getModuleName( entry.file ) + '__default;';
		body.append( '\n\n' + exportStatement );
	}

	intro = introTemplate({
		amdDeps: bundle.externalModules.length ? '[' + bundle.externalModules.map( quote ).join( ', ' ) + '], ' : '',
		names: bundle.externalModules.join( ', ' )
	}).replace( /\t/g, body.indentStr );

	body.indent().prepend( intro ).trim().append( '\n\n});' );
	return body.toString();
}

function quote ( str ) {
	return "'" + str + "'";
}
import template from '../../../utils/template';
import getExportBlock from './utils/getExportBlock';

var introTemplate;

export default function amd ( bundle, body ) {
	var defaultsBlock,
		entry = bundle.entryModule,
		exportBlock,
		externalModules,
		importPaths,
		importNames,
		intro;

	defaultsBlock = bundle.externalModules.map( x => {
		return `var ${x.name}__default = ('default' in ${x.name} ? ${x.name}.default : ${x.name});`;
	}).join( '\n' );

	if ( defaultsBlock ) {
		body.prepend( defaultsBlock + '\n\n' );
	}

	if ( entry.exports.length ) {
		importPaths = [ 'exports' ].concat( bundle.externalModules.map( getPath ) );
		importNames = [ 'exports' ].concat( bundle.externalModules.map( getName ) );

		exportBlock = getExportBlock( entry, body.indentStr );
		body.append( '\n\n' + exportBlock );
	} else {
		importPaths = bundle.externalModules.map( getPath );
		importNames = bundle.externalModules.map( getName );
	}

	intro = introTemplate({
		amdDeps: importPaths.length ? '[' + importPaths.map( quote ).join( ', ' ) + '], ' : '',
		names: importNames.join( ', ' )
	}).replace( /\t/g, body.indentStr );

	body.indent().prepend( intro ).trim().append( '\n\n});' );
	return body.toString();
}

function quote ( str ) {
	return "'" + str + "'";
}

function getPath ( m ) { return m.path; }
function getName ( m ) { return m.name; }

introTemplate = template( 'define(<%= amdDeps %>function (<%= names %>) {\n\n\t\'use strict\';\n\n' );

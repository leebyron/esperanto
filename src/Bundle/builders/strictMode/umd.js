import template from '../../../utils/template';
import getExportBlock from './utils/getExportBlock';

var introTemplate;

export default function umd ( bundle, body, options ) {
	var defaultsBlock,
		entry = bundle.entryModule,
		exportBlock,
		amdDeps,
		cjsDeps,
		globals,
		names,
		intro;

	if ( !options || !options.name ) {
		throw new Error( 'You must specify an export name, e.g. `bundle.toUmd({ name: "myModule" })`' );
	}

	defaultsBlock = bundle.externalModules.map( x => {
		return `var ${x}__default = ('default' in ${x} ? ${x}.default : ${x});`;
	}).join( '\n' );

	if ( defaultsBlock ) {
		body.prepend( defaultsBlock + '\n\n' );
	}

	if ( entry.exports.length ) {
		amdDeps = [ 'exports' ].concat( bundle.externalModules ).map( quote ).join( ', ' );
		cjsDeps = [ 'exports' ].concat( bundle.externalModules.map( req ) ).join( ', ' );
		globals = [ options.name ].concat( bundle.externalModules ).map( globalify ).join( ', ' );
		names = [ 'exports' ].concat( bundle.externalModules ).join( ', ' );

		exportBlock = getExportBlock( entry, body.indentStr );
		body.append( '\n\n' + exportBlock );
	} else {
		amdDeps = bundle.externalModules.map( quote ).join( ', ' );
		cjsDeps = bundle.externalModules.map( req ).join( ', ' );
		globals = bundle.externalModules.map( globalify ).join( ', ' );
		names = bundle.externalModules.join( ', ' );
	}

	intro = introTemplate({
		amdDeps: amdDeps,
		cjsDeps: cjsDeps,
		globals: globals,
		names: names,
		name: options.name
	}).replace( /\t/g, body.indentStr );

	body.indent().prepend( intro ).trim().append( '\n\n});' );
	return body.toString();
}

function quote ( str ) {
	return "'" + str + "'";
}

function req ( path ) {
	return 'require(' + path + ')';
}

function globalify ( name ) {
	return 'global.' + name;
}

introTemplate = template( `(function (global, factory) {

	'use strict';

	if (typeof define === 'function' && define.amd) {
		// export as AMD
		define([<%= amdDeps %>], factory);
	} else if (typeof module !== 'undefined' && module.exports && typeof require === 'function') {
		// node/browserify
		factory(<%= cjsDeps %>);
	} else {
		// browser global
		global.<%= name %> = {};
		factory(<%= globals %>);
	}

}(typeof window !== 'undefined' ? window : this, function (<%= names %>) {

	'use strict';

` );
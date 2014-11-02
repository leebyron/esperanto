import acorn from 'acorn';
import Source from '../Source';
import parse from './prototype/parse';
import toAmd from './prototype/toAmd';
import toCjs from './prototype/toCjs';
import toStatement from './prototype/toStatement';
import toUmd from './prototype/toUmd';

var Module = function ( options ) {
	this.source = options.source;
	this.file = options.file;

	this.ast = acorn.parse( this.source, {
		ecmaVersion: 6,
		locations: true
	});

	this.imports = [];
	this.exports = [];

	this.parse({
		getModuleName: options.getModuleName
	});

	// remove imports and exports from body
	this.body = new Source( options.source, options.file );

	this.imports.forEach( x => this.body.remove( x.start, x.next ) );

	this.exports.forEach( x => {
		if ( x.declaration ) {
			this.body.replace( x.start, x.end, x.value );
		} else {
			this.body.remove( x.start, x.next );
		}
	});
};

Module.prototype = {
	parse: parse,
	toAmd: toAmd,
	toCjs: toCjs,
	toStatement: toStatement,
	toUmd: toUmd
};

export default Module;

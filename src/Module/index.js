import acorn from 'acorn';
import MagicString from 'magic-string';
import parse from './prototype/parse';
import toAmd from './prototype/toAmd';
import toCjs from './prototype/toCjs';
import toUmd from './prototype/toUmd';

var Module = function ( options ) {
	this.source = options.source;
	this.file = options.file;

	this.ast = acorn.parse( this.source, {
		ecmaVersion: 6,
		locations: true,
		forbidReserved: false
	});

	this.imports = [];
	this.exports = [];

	this.parse({
		getModuleName: options.getModuleName
	});

	// remove imports and exports from body
	this.body = new MagicString( options.source );
};

Module.prototype = {
	parse: parse,
	toAmd: toAmd,
	toCjs: toCjs,
	toUmd: toUmd
};

export default Module;

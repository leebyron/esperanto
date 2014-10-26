import acorn from 'acorn';
import parse from './prototype/parse';
import toAmd from './prototype/toAmd';
import toCjs from './prototype/toCjs';

var Module = function ( options ) {
	this.source = options.source;
	this.file = options.file;

	this.ast = acorn.parse( this.source, {
		ecmaVersion: 6,
		locations: true
	});

	this.imports = [];
	this.exports = [];

	this.parse();
};

Module.prototype = {
	parse: parse,
	toAmd: toAmd,
	toCjs: toCjs
};

export default Module;

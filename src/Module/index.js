import acorn from 'acorn';
import MagicString from 'magic-string';
import parse from './prototype/parse';

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

	this.body = new MagicString( options.source );
};

Module.prototype = {
	parse: parse
};

export default Module;

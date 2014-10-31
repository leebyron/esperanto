import path from 'path';
import sander from 'sander';
import collect from './prototype/collect';
import toEs6 from './prototype/toEs6';

var Promise = sander.Promise;

var Bundle = function ( options ) {
	this.entry = options.entry;
	this.getImportName = options.getImportName;

	this.baseUrl = options.baseUrl ? path.resolve( options.baseUrl ) : process.cwd();

	this.modules = [];
	this.moduleByPath = {};

	this.externalModules = [];
};

Bundle.prototype = {
	collect: collect,
	toEs6: toEs6
};

export default Bundle;

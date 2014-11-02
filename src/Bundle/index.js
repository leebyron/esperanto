import path from 'path';
import moduleNameHelper from './utils/moduleNameHelper';
import collect from './prototype/collect';
import toEs6 from './prototype/toEs6';

var Bundle = function ( options ) {
	this.entry = options.entry;

	this.base = options.base ? path.resolve( options.base ) : process.cwd();
	this.getModuleName = moduleNameHelper( options.getModuleName );

	this.modules = null;
	this.externalModules = [];
};

Bundle.prototype = {
	collect: collect,
	toEs6: toEs6
};

export default Bundle;

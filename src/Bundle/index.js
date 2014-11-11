import path from 'path';
import moduleNameHelper from './utils/moduleNameHelper';
import _collect from './prototype/_collect';
import _combine from './prototype/_combine';
import _resolveChains from './prototype/_resolveChains';

var Bundle = function ( options ) {
	this.entry = options.entry;

	this.base = options.base ? path.resolve( options.base ) : process.cwd();
	this.getModuleName = moduleNameHelper( options.getModuleName );

	this.modules = null;
	this.moduleLookup = {};

	this.externalModules = [];
	this.externalModuleLookup = {};

	this.skip = options.skip;
	this.names = options.names || {};
};

Bundle.prototype = {
	_collect: _collect,
	_combine: _combine,
	_resolveChains: _resolveChains
};

export default Bundle;

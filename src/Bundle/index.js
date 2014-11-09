import path from 'path';
import moduleNameHelper from './utils/moduleNameHelper';
import _collect from './prototype/_collect';
import _combine from './prototype/_combine';
import _resolveChains from './prototype/_resolveChains';
import toAmd from './prototype/toAmd';
import toCjs from './prototype/toCjs';
import toEs6 from './prototype/toEs6';
import toUmd from './prototype/toUmd';

var Bundle = function ( options ) {
	this.entry = options.entry;

	this.base = options.base ? path.resolve( options.base ) : process.cwd();
	this.getModuleName = moduleNameHelper( options.getModuleName );

	this.modules = null;
	this.moduleLookup = {};
	this.externalModules = [];
};

Bundle.prototype = {
	_collect: _collect,
	_combine: _combine,
	_resolveChains: _resolveChains,
	toAmd: toAmd,
	toCjs: toCjs,
	toEs6: toEs6,
	toUmd: toUmd
};

export default Bundle;

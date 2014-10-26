import Module from './Module';
import amd from './generators/amd';
import cjs from './generators/cjs';

export default {
	toAmd: function ( source, options ) {
		return new Module({ source: source }).toAmd( options || {} );
	},

	toCjs: function ( source, options ) {
		return new Module({ source: source }).toCjs( options || {} );
	}
};

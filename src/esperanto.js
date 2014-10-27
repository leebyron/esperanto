import Module from './Module';

export default {
	toAmd: function ( source, options ) {
		return new Module({ source: source }).toAmd( options || {} );
	},

	toCjs: function ( source, options ) {
		return new Module({ source: source }).toCjs( options || {} );
	}
};

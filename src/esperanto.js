import Module from './Module';
import Bundle from './Bundle';

function transpileMethod ( methodName ) {
	return function ( source, options ) {
		options = options || {};

		return new Module({
			source: source,
			getModuleName: options.getModuleName
		})[ methodName ]( options );
	};
}

export default {
	toAmd: transpileMethod( 'toAmd' ),
	toCjs: transpileMethod( 'toCjs' ),
	toStatement: transpileMethod( 'toStatement' ),
	toUmd: transpileMethod( 'toUmd' ),

	bundle: function ( options ) {
		var bundle = new Bundle( options );
		return bundle.collect().then( () => bundle );
	}
};

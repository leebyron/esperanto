import Module from './Module';
import builders from './Module/builders';
import Bundle from './Bundle';

var formats = {
	toAmd: 'amd',
	toCjs: 'cjs',
	toUmd: 'umd'
};

function transpileMethod ( methodName ) {
	return function ( source, options ) {
		options = options || {};

		return new Module({
			source: source,
			getModuleName: options.getModuleName
		})[ methodName ]( options );
	};
}

function altTranspileMethod ( format ) {
	return function ( source, options ) {
		var module,
			builder,
			mode;

		options = options || {};
		mode = options.defaultOnly ? 'defaultsMode' : 'strictMode';

		module = new Module({ source: source, getModuleName: options.getModuleName });
		builder = builders[ mode ][ format ];

		return builder( module, module.body.clone(), options );
	}
}

export default {
	toAmd: altTranspileMethod( 'amd' ),
	toCjs: altTranspileMethod( 'cjs' ),
	toUmd: altTranspileMethod( 'umd' ),

	bundle: function ( options ) {
		var bundle = new Bundle( options );
		return bundle.collect().then( () => bundle );
	}
};

import Module from './Module';
import builders from './Module/builders';
import disallowNames from './utils/disallowNames';
import Bundle from './Bundle';

function transpileMethod ( format ) {
	return function ( source, options ) {
		var module,
			builder;

		options = options || {};
		module = new Module({ source: source, getModuleName: options.getModuleName });

		if ( options.defaultOnly ) {
			disallowNames( module );
			builder = builders.defaultsMode[ format ];
		} else {
			builder = builders.strictMode[ format ];
		}

		return builder( module, module.body.clone(), options );
	};
}

export default {
	toAmd: transpileMethod( 'amd' ),
	toCjs: transpileMethod( 'cjs' ),
	toUmd: transpileMethod( 'umd' ),

	bundle: function ( options ) {
		var bundle = new Bundle( options );
		return bundle.collect().then( () => bundle );
	}
};

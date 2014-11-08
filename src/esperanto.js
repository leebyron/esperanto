import Module from './Module';
import builders from './Module/builders';
import disallowNames from './utils/disallowNames';
import annotateAst from './utils/annotateAst';
import replaceReferences from './utils/replaceReferences';
import Bundle from './Bundle';

function transpileMethod ( format ) {
	return function ( source, options ) {
		var module,
			body,
			builder;

		options = options || {};
		module = new Module({ source: source, getModuleName: options.getModuleName });
		body = module.body.clone();

		if ( options.defaultOnly ) {
			// ensure there are no named imports/exports
			disallowNames( module );

			builder = builders.defaultsMode[ format ];
		} else {
			// annotate AST with scope info
			annotateAst( module.ast );

			// replace references
			replaceReferences( module, body );

			builder = builders.strictMode[ format ];
		}

		return builder( module, body, options );
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

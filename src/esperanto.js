import Module from './Module';
import moduleBuilders from './Module/builders';
import bundleBuilders from './Bundle/builders';
import disallowNames from './utils/disallowNames';
import annotateAst from './utils/annotateAst';
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
			builder = moduleBuilders.defaultsMode[ format ];
		} else {
			// annotate AST with scope info
			annotateAst( module.ast );
			builder = moduleBuilders.strictMode[ format ];
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
		return bundle._collect().then( function () {
			return {
				toAmd: options => transpile( 'amd', options ),
				toCjs: options => transpile( 'cjs', options ),
				toUmd: options => transpile( 'umd', options )
			};

			function transpile ( format, options ) {
				var entry, builder;

				options = options || {};

				if ( options.defaultOnly ) {
					// ensure there are no named imports/exports
					entry = bundle.entryModule;
					entry.exports.forEach( x => {
						if ( !x.default ) {
							throw new Error( 'Entry module cannot have named exports in defaultOnly mode' );
						}
					});

					builder = bundleBuilders.defaultsMode[ format ];
				} else {
					builder = bundleBuilders.strictMode[ format ];
				}

				return builder( bundle, bundle.body.clone(), options );
			}
		});
	}
};

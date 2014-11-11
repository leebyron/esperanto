import getStandaloneModule from './standalone/getModule';
import getBundle from './bundler/getBundle';
import moduleBuilders from './standalone/builders';
import bundleBuilders from './bundler/builders';
import disallowNames from './utils/disallowNames';
import annotateAst from './utils/annotateAst';

function transpileMethod ( format ) {
	return function ( source, options ) {
		var module,
			body,
			builder,
			getModuleName;

		options = options || {};
		module = getStandaloneModule({ source: source, getModuleName: options.getModuleName });
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
		return getBundle( options ).then( function ( bundle ) {
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

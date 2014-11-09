var path = require( 'path' ),
	assert = require( 'assert' ),
	sander = require( 'sander' ),
	Promise = sander.Promise,
	esperanto;

global.assert = assert;

module.exports = function () {
	function getModuleName ( path ) {
		return '__' + path.split( '/' ).pop();
	}

	describe( 'esperanto.bundle()', function () {
		var profiles, tests;

		before( function () {
			return Promise.all([
				require( '../utils/build' )().then( function ( lib ) {
					esperanto = lib;
				}),

				sander.rimraf( '.tmp-bundle' )
			]);
		});

		describe( 'ES6 module semantics tests from es6-module-transpiler:', function () {
			var tests = [
				{ entry: 'importer', dir: 'bare-import' },
				{ entry: 'importer', dir: 'bindings' },
				{ entry: 'c', dir: 'cycles' },
				{ entry: 'importer', dir: 'cycles-defaults' },
				{ entry: 'main', dir: 'cycles-immediate' },
				{ entry: 'importer', dir: 'duplicate-import-fails' },
				{ entry: 'importer', dir: 'duplicate-import-specifier-fails' },
				{ entry: 'second', dir: 'export-and-import-reference-share-var' },
				{ entry: 'importer', dir: 'export-default' },
				{ entry: 'importer', dir: 'export-default-function' },
				{ entry: 'importer', dir: 'export-default-named-function' },
				{ entry: 'third', dir: 'export-from' },
				//{ entry: 'third', dir: 'export-from-default' }, // pending https://github.com/marijnh/acorn/pull/15
				{ entry: 'importer', dir: 'export-function' },
				{ entry: 'importer', dir: 'export-list' },
				{ entry: 'importer', dir: 'export-mixins' },
				{ entry: 'index', dir: 'export-not-at-top-level-fails', expectedError: 'Unexpected reserved word' },
				{ entry: 'importer', dir: 'export-var' },
				{ entry: 'importer', dir: 'import-as' },
				{ entry: 'third', dir: 'import-chain' },
				{ entry: 'index', dir: 'import-not-at-top-level-fails', expectedError: 'Unexpected reserved word' },
				{ entry: 'mod', dir: 'module-level-declarations' },
				{ entry: 'importer', dir: 'named-function-expression' },
				{ entry: 'importer', dir: 'namespace-reassign-import-fails', expectedError: 'Cannot reassign imported binding of namespace `exp`' },
				{ entry: 'importer', dir: 'namespace-update-import-fails', expectedError: 'Cannot reassign imported binding of namespace `exp`' },
				{ entry: 'importer', dir: 'namespaces' },
				{ entry: 'third', dir: 're-export-default-import' },
				{ entry: 'importer', dir: 'reassign-import-fails', expectedError: 'Cannot reassign imported binding `x`' },
				{ entry: 'importer', dir: 'reassign-import-not-at-top-level-fails', expectedError: 'Cannot reassign imported binding `x`' },
				{ entry: 'mod', dir: 'this-is-global' },
				{ entry: 'importer', dir: 'update-expression-of-import-fails', expectedError: 'Cannot reassign imported binding `a`' }
			];

			tests.forEach( function ( t ) {
				var cjs;

				it( t.dir, function () {
					// Create CommonJS modules, then require the entry module
					return esperanto.bundle({
						base: path.resolve( 'es6-module-transpiler', t.dir ),
						entry: t.entry
					})
					.then( function ( bundle ) {
						cjs = bundle.toCjs();
						return sander.writeFile( '.tmp-bundle', t.dir + '.js', cjs );
					})
					.then( function () {
						var missingError;

						try {
							require( path.resolve( '.tmp-bundle', t.dir ) );
							if ( t.expectedError ) {
								missingError = true;
							}
						} catch( err ) {
							if ( !t.expectedError || !~err.message.indexOf( t.expectedError ) ) {
								console.log( 'bundle>>>\n%s\n<<<', cjs );
								throw err;
							}
						}

						if ( missingError ) {
							console.log( 'bundle>>>\n%s\n<<<', cjs );
							throw new Error( 'Expected error "' + t.expectedError + '"' );
						}
					}, function ( err ) {
						if ( !t.expectedError || !~err.message.indexOf( t.expectedError ) ) {
							console.log( 'bundle>>>\n%s\n<<<', cjs );
							throw err;
						}
					});
				});
			});
		});

		profiles = [
			{ description: 'bundle.toAmd({ defaultOnly: true })', method: 'toAmd', outputdir: 'amdDefaults', options: { defaultOnly: true } },
			{ description: 'bundle.toCjs({ defaultOnly: true })', method: 'toCjs', outputdir: 'cjsDefaults', options: { defaultOnly: true } },
			//{ description: 'bundle.toEs6({ defaultOnly: true })', method: 'toEs6', outputdir: 'es6Defaults', options: { defaultOnly: true } },
			{ description: 'bundle.toUmd({ defaultOnly: true })', method: 'toUmd', outputdir: 'umdDefaults', options: { defaultOnly: true, name: 'myModule' } },
			{ description: 'bundle.toAmd()', method: 'toAmd', outputdir: 'amd' },
			{ description: 'bundle.toCjs()', method: 'toCjs', outputdir: 'cjs' },
			//{ description: 'bundle.toEs6()', method: 'toEs6', outputdir: 'es6' },
			{ description: 'bundle.toUmd()', method: 'toUmd', outputdir: 'umd', options: { name: 'myModule' } }
		];

		tests = [
			{ dir: '1', description: 'bundles a simple collection of modules' },
			{ dir: '2', description: 'bundles modules in index.js files' },
			{ dir: '3', description: 'allows external imports' },
			{ dir: '4', description: 'exports a default export' },
			{ dir: '5', description: 'exports named exports', 'named': true }
		];

		profiles.forEach( function ( profile ) {
			describe( profile.description + ':', function () {
				tests.forEach( function ( t ) {
					if ( t.named && profile.options && profile.options.defaultOnly ) {
						return;
					}

					it( t.description, function () {
						return esperanto.bundle({
							base: path.resolve( 'bundle/input', t.dir ),
							entry: t.entry || 'main'
						}).then( function ( bundle ) {
							var actual = bundle[ profile.method ]( profile.options );

							return sander.readFile( 'bundle/output/', profile.outputdir, t.dir + '.js' ).then( String ).then( function ( expected ) {
								assert.equal( actual, expected, 'Expected\n>\n' +
									makeWhitespaceVisible( actual ) +
								'\n>\n\nto match\n\n>\n' +
									makeWhitespaceVisible( expected ) +
								'\n>' );
							});
						});
					});
				});
			});
		});
	});
};

function makeWhitespaceVisible ( str ) {
	return str.replace( /^\t+/gm, function ( match ) {
		// replace leading tabs
		return match.replace( /\t/g, '--->' );
	}).replace( /^( +)/gm, function ( match, $1 ) {
		// replace leading spaces
		return $1.replace( / /g, '*' );
	}).replace( /\t+$/gm, function ( match ) {
		// replace trailing tabs
		return match.replace( /\t/g, '--->' );
	}).replace( /( +)$/gm, function ( match, $1 ) {
		// replace trailing spaces
		return $1.replace( / /g, '*' );
	});
}
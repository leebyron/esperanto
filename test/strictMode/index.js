var path = require( 'path' ),
	assert = require( 'assert' ),
	sander = require( 'sander' ),
	Promise = sander.Promise,
	esperanto;

global.assert = assert;

module.exports = function () {
	function getModuleName ( path ) {
		return '__' + path.split( '/' ).pop().replace( /\.js$/, '' );
	}

	describe( 'esperanto', function () {
		before( function () {
			return require( '../utils/build' )().then( function ( lib ) {
				esperanto = lib;
			});
		});

		// Check results match expectations
		// compare( 'exportDefault', 'transpiles default exports' );
		// compare( 'exportNamed', 'transpiles named exports' );
		// compare( 'earlyExport', 'transpiles exports that are not the final statement' );
		// compare( 'emptyImport', 'transpiles empty imports with no exports' );
		// compare( 'emptyImportWithDefaultExport', 'transpiles empty imports with default exports' );
		// compare( 'exportInlineFunction', 'transpiles named inline function exports' );
		// compare( 'exportVar', 'transpiles named inline variable exports' );
		// compare( 'exportLet', 'transpiles named inline let exports' );
		// compare( 'importAll', 'transpiles import * as foo from "foo"' );
		// compare( 'importDefault', 'transpiles default imports' );
		// compare( 'importNamed', 'transpiles named imports' );
		// compare( 'mixedImports', 'transpiles mixed named/default imports' );
		// compare( 'multipleImports', 'transpiles multiple imports' );
		// compare( 'renamedImport', 'transpiles renamed imports' );
		// compare( 'trailingEmptyImport', 'transpiles trailing empty imports' );

		// TODO handle tests that cause errors
		verifySemantics( 'importer', 'bare-import' );
		verifySemantics( 'importer', 'bindings' );
		verifySemantics( 'c', 'cycles' );
		verifySemantics( 'importer', 'cycles-defaults' );
		verifySemantics( 'main', 'cycles-immediate' );
		verifySemantics( 'importer', 'duplicate-import-fails' );
		verifySemantics( 'importer', 'duplicate-import-specifier-fails' );
		verifySemantics( 'second', 'export-and-import-reference-share-var' );
		verifySemantics( 'importer', 'export-default' );
		verifySemantics( 'importer', 'export-default-function' );
		verifySemantics( 'importer', 'export-default-named-function' );
		verifySemantics( 'third', 'export-from' );
		// verifySemantics( 'third', 'export-from-default' ); // pending https://github.com/marijnh/acorn/pull/154
		verifySemantics( 'importer', 'export-function' );
		verifySemantics( 'importer', 'export-list' );
		verifySemantics( 'importer', 'export-mixins' );
		verifySemantics( 'index', 'export-not-at-top-level-fails', 'Unexpected reserved word' );
		verifySemantics( 'importer', 'export-var' );
		verifySemantics( 'importer', 'import-as' );
		verifySemantics( 'third', 'import-chain' );
		verifySemantics( 'index', 'import-not-at-top-level-fails', 'Unexpected reserved word' );
		verifySemantics( 'mod', 'module-level-declarations' );
		verifySemantics( 'importer', 'named-function-expression' );
		verifySemantics( 'importer', 'namespace-reassign-import-fails', 'Cannot reassign imported binding of namespace `exp`' );
		verifySemantics( 'importer', 'namespace-update-import-fails', 'Cannot reassign imported binding of namespace `exp`' );
		verifySemantics( 'importer', 'namespaces' );
		verifySemantics( 'third', 're-export-default-import' );
		verifySemantics( 'importer', 'reassign-import-fails', 'Cannot reassign imported binding `x`' );
		verifySemantics( 'importer', 'reassign-import-not-at-top-level-fails', 'Cannot reassign imported binding `x`' ); // not a runtime check...
		verifySemantics( 'mod', 'this-is-global' );
		verifySemantics( 'importer', 'update-expression-of-import-fails', 'Cannot reassign imported binding `a`' );
	});

	function compare ( file, description ) {
		var getSource;

		file += '.js';
		getSource = sander.readFile( 'samples', file ).then( String );

		it( description + ' to AMD', function () {
			return getSource.then( function ( source ) {
				return sander.readFile( 'strictMode/output/amd', file ).then( String ).then( function ( expected ) {
					var actual = esperanto.toAmd( source, {
						mode: 'strict'
					});

					assert.equal( actual, expected, 'AMD: Expected\n>\n' + actual + '\n>\n\nto match\n\n>\n' + expected + '\n>' );
				});
			});
		});

		it( description + ' to CommonJS', function () {
			return getSource.then( function ( source ) {
				return sander.readFile( 'strictMode/output/cjs', file ).then( String ).then( function ( expected ) {
					var actual = esperanto.toCjs( source, {
						mode: 'strict'
					});

					assert.equal( actual, expected, 'CommonJS: Expected\n>\n' + actual + '\n>\n\nto match\n\n>\n' + expected + '\n>' );
				});
			});
		});

		it( description + ' to UMD', function () {
			return getSource.then( function ( source ) {
				return sander.readFile( 'strictMode/output/umd', file ).then( String ).then( function ( expected ) {
					var actual = esperanto.toUmd( source, {
						mode: 'strict',
						name: 'myModule',
						getModuleName: getModuleName
					});

					assert.equal( actual, expected, 'UMD: Expected\n>\n' + actual + '\n>\n\nto match\n\n>\n' + expected + '\n>' );
				});
			});
		});
	}

	function verifySemantics ( entry, dir, errorMessage ) {
		it( 'should satisfy ' + dir + ' tests', function () {
			// Create CommonJS modules, then require the entry module
			return sander.readdir( 'semantics', dir ).then( function ( files ) {
				var promises = files.map( function ( file ) {
					return sander.readFile( 'semantics', dir, file ).then( String ).then( function ( source ) {
						var transpiled = esperanto.toCjs( source, {
							mode: 'strict'
						});

						return sander.writeFile( '.semantics-tmp', dir, file, transpiled );
					});
				});

				return Promise.all( promises ).then( function () {
					require( path.resolve( '.semantics-tmp', dir, entry ) );
				});
			}).catch( function ( err ) {
				if ( errorMessage && ~err.message.indexOf( errorMessage ) ) {
					// copacetic
					return;
				}

				throw err;
			});
		});
	}
};

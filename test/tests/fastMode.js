var assert = require( 'assert' ),
	sander = require( 'sander' ),
	Promise = sander.Promise,
	esperanto;

module.exports = function () {
	function getModuleName ( path ) {
		return '__' + path.split( '/' ).pop();
	}

	describe( 'esperanto', function () {
		before( function () {
			return require( '../utils/build' )().then( function ( lib ) {
				esperanto = lib;
			});
		});

		describe( 'transpiles default exports', function () {
			return compare( 'exportDefault', { namedOnly: false });
		});

		describe( 'transpiles named exports', function () {
			return compare( 'exportNamed', { namedOnly: true });
		});

		describe( 'transpiles exports that are not the final statement', function () {
			return compare( 'earlyExport', { namedOnly: false });
		});

		describe( 'transpiles empty imports with no exports', function () {
			return compare( 'emptyImport', { namedOnly: false });
		});

		describe( 'transpiles empty imports with default exports', function () {
			return compare( 'emptyImportWithDefaultExport', { namedOnly: false });
		});

		describe( 'transpiles named inline function exports', function () {
			return compare( 'exportInlineFunction', { namedOnly: true });
		});

		describe( 'transpiles named inline variable exports', function () {
			return compare( 'exportVar', { namedOnly: true });
		});

		describe( 'transpiles named inline let exports', function () {
			return compare( 'exportLet', { namedOnly: true });
		});

		describe( 'transpiles import * as foo from "foo"', function () {
			return compare( 'importAll', { namedOnly: false });
		});

		describe( 'transpiles default imports', function () {
			return compare( 'importDefault', { namedOnly: false });
		});

		describe( 'transpiles named imports', function () {
			return compare( 'importNamed', { namedOnly: true });
		});

		describe( 'transpiles mixed named/default imports', function () {
			return compare( 'mixedImports', { namedOnly: true });
		});

		describe( 'transpiles multiple imports', function () {
			return compare( 'multipleImports', { namedOnly: false });
		});

		describe( 'transpiles renamed imports', function () {
			return compare( 'renamedImport', { namedOnly: true });
		});

		describe( 'transpiles trailing empty imports', function () {
			return compare( 'trailingEmptyImport', { namedOnly: false });
		});
	});

	function compare ( file, options ) {
		var getSource;

		file += '.js';
		getSource = sander.readFile( 'input', file ).then( String );

		it( 'to AMD (named)', function () {
			return getSource.then( function ( source ) {
				return sander.readFile( 'output/amd', file ).then( String ).then( function ( expected ) {
					var actual = esperanto.toAmd( source, {
						defaultOnly: false
					});

					assert.equal( actual, expected, 'AMD (named): Expected\n>\n' + actual + '\n>\n\nto match\n\n>\n' + expected + '\n>' );
				});
			});
		});

		it( 'to CommonJS (named)', function () {
			return getSource.then( function ( source ) {
				return sander.readFile( 'output/cjs', file ).then( String ).then( function ( expected ) {
					var actual = esperanto.toCjs( source, {
						defaultOnly: false
					});

					assert.equal( actual, expected, 'CommonJS (named): Expected\n>\n' + actual + '\n>\n\nto match\n\n>\n' + expected + '\n>' );
				});
			});
		});

		it( 'to UMD (named)', function () {
			return getSource.then( function ( source ) {
				return sander.readFile( 'output/umd', file ).then( String ).then( function ( expected ) {
					var actual = esperanto.toUmd( source, {
						defaultOnly: false,
						name: 'myModule',
						getModuleName: getModuleName
					});

					assert.equal( actual, expected, 'UMD (named): Expected\n>\n' + actual + '\n>\n\nto match\n\n>\n' + expected + '\n>' );
				});
			});
		});

		if ( !options.namedOnly ) {
			it( 'to AMD (defaultOnly)', function () {
				return getSource.then( function ( source ) {
					return sander.readFile( 'output/amdDefaults', file ).then( String ).then( function ( expected ) {
						var actual = esperanto.toAmd( source, {
							defaultOnly: true
						});

						assert.equal( actual, expected, 'AMD (defaultOnly): Expected\n>\n' + actual + '\n>\n\nto match\n\n>\n' + expected + '\n>' );
					});
				});
			});

			it( 'to CommonJS (defaultOnly)', function () {
				return getSource.then( function ( source ) {
					return sander.readFile( 'output/cjsDefaults', file ).then( String ).then( function ( expected ) {
						var actual = esperanto.toCjs( source, {
							defaultOnly: true
						});

						assert.equal( actual, expected, 'CommonJS (defaultOnly): Expected\n>\n' + actual + '\n>\n\nto match\n\n>\n' + expected + '\n>' );
					});
				});
			});

			it( 'to UMD (defaultOnly)', function () {
				return getSource.then( function ( source ) {
					return sander.readFile( 'output/umdDefaults', file ).then( String ).then( function ( expected ) {
						var actual = esperanto.toUmd( source, {
							name: 'myModule',
							defaultOnly: true
						});

						assert.equal( actual, expected, 'UMD (defaultOnly): Expected\n>\n' + actual + '\n>\n\nto match\n\n>\n' + expected + '\n>' );
					});
				});
			});
		}
	}
};

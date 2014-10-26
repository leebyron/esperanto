var assert = require( 'assert' ),
	sander = require( 'sander' ),
	Promise = sander.Promise,
	esperanto;

process.chdir( __dirname );

describe( 'esperanto', function () {
	before( function () {
		return require( './utils/build' )().then( function ( lib ) {
			esperanto = lib;
		});
	});

	it( 'transpiles default exports', function () {
		return compare( 'exportDefault', { namedOnly: false });
	});

	it( 'transpiles named exports', function () {
		return compare( 'exportNamed', { namedOnly: true });
	});

	it( 'transpiles exports that are not the final statement', function () {
		return compare( 'earlyExport', { namedOnly: false });
	});

	it( 'transpiles empty imports', function () {
		return compare( 'emptyImport', { namedOnly: false });
	});

	it( 'transpiles empty imports with default exports', function () {
		return compare( 'emptyImportWithDefaultExport', { namedOnly: false });
	});

	it( 'transpiles named inline function exports', function () {
		return compare( 'exportInlineFunction', { namedOnly: true });
	});

	it( 'transpiles named inline variable exports', function () {
		return compare( 'exportVar', { namedOnly: true });
	});

	it( 'transpiles import * as foo from "foo"', function () {
		return compare( 'importAll', { namedOnly: false });
	});

	it( 'transpiles default imports', function () {
		return compare( 'importDefault', { namedOnly: false });
	});

	it( 'transpiles named imports', function () {
		return compare( 'importNamed', { namedOnly: true });
	});

	it( 'transpiles mixed named/default imports', function () {
		return compare( 'mixedImports', { namedOnly: true });
	});

	it( 'transpiles multiple imports', function () {
		return compare( 'multipleImports', { namedOnly: false });
	});

	it( 'transpiles renamed imports', function () {
		return compare( 'renamedImport', { namedOnly: true });
	});

	it( 'transpiles trailing empty imports', function () {
		return compare( 'trailingEmptyImport', { namedOnly: false });
	});
});

function compare ( file, options ) {
	file += '.js';

	return sander.readFile( 'input', file ).then( String ).then( function ( source ) {
		var promises = [
			sander.readFile( 'output/amd', file ).then( String ).then( function ( expected ) {
				assert.equal( esperanto.toAmd( source ), expected, 'AMD (named)' );
			}),

			sander.readFile( 'output/cjs', file ).then( String ).then( function ( expected ) {
				assert.equal( esperanto.toCjs( source ), expected, 'AMD (default only)' );
			})
		];

		if ( !options.namedOnly ) {
			promises.push(
				sander.readFile( 'output/amdDefaults', file ).then( String ).then( function ( expected ) {
					assert.equal( esperanto.toAmd( source, { defaultOnly: true }), expected, 'CJS (named)' );
				}),

				sander.readFile( 'output/cjsDefaults', file ).then( String ).then( function ( expected ) {
					assert.equal( esperanto.toCjs( source, { defaultOnly: true }), expected, 'CJS (default only)' );
				})
			);
		}

		return Promise.all( promises );
	});
}
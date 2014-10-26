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

	describe( 'transpiles default exports', function () {
		return compare( 'exportDefault', { namedOnly: false });
	});

	describe( 'transpiles named exports', function () {
		return compare( 'exportNamed', { namedOnly: true });
	});

	describe( 'transpiles exports that are not the final statement', function () {
		return compare( 'earlyExport', { namedOnly: false });
	});

	describe( 'transpiles empty imports', function () {
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
				assert.equal( esperanto.toAmd( source ), expected, 'AMD (named)' );
			});
		});
	});

	it( 'to CommonJS (named)', function () {
		return getSource.then( function ( source ) {
			return sander.readFile( 'output/cjs', file ).then( String ).then( function ( expected ) {
				assert.equal( esperanto.toCjs( source ), expected, 'AMD (named)' );
			});
		});
	});

	if ( !options.namedOnly ) {
		it( 'to AMD (defaultOnly)', function () {
			return getSource.then( function ( source ) {
				return sander.readFile( 'output/amdDefaults', file ).then( String ).then( function ( expected ) {
					assert.equal( esperanto.toAmd( source, { defaultOnly: true }), expected, 'AMD (defaultOnly)' );
				});
			});
		});

		it( 'to CommonJS (defaultOnly)', function () {
			return getSource.then( function ( source ) {
				return sander.readFile( 'output/cjsDefaults', file ).then( String ).then( function ( expected ) {
					assert.equal( esperanto.toCjs( source, { defaultOnly: true }), expected, 'AMD (defaultOnly)' );
				});
			});
		});
	}
}
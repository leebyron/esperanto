var assert = require( 'assert' ),
	sander = require( 'sander' ),
	Promise = sander.Promise,
	esperanto;

module.exports = function () {
	function getModuleName ( path ) {
		return '__' + path.split( '/' ).pop();
	}

	describe( 'esperanto.bundle()', function () {
		before( function () {
			return require( '../utils/build' )().then( function ( lib ) {
				esperanto = lib;
			});
		});

		it( 'bundles modules', function () {
			return esperanto.bundle({
				baseUrl: 'bundles/1',
				entry: 'foo'
			}).then( function ( bundle ) {
				console.log( 'bundle', bundle.toEs6() );
			});
		});

		it( 'follows /index.js paths', function () {
			return esperanto.bundle({
				baseUrl: 'bundles/2',
				entry: 'foo'
			}).then( function ( bundle ) {
				console.log( 'bundle', bundle.toEs6() );
			});
		});

		it( 'keeps imports it can\'t resolve', function () {
			return esperanto.bundle({
				baseUrl: 'bundles/3',
				entry: 'foo'
			}).then( function ( bundle ) {
				console.log( 'bundle', bundle.toEs6() );
			});
		});
	});
};

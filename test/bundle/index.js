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

		it( 'bundles as CommonJS', function () {
			return esperanto.bundle({
				base: 'bundle/input/1',
				entry: 'main'
			}).then( function ( bundle ) {
				var result = bundle.toCjs({
					defaultOnly: true,
					name: 'main',
					getModuleName: function ( path ) {
						return path.split( '/' ).pop();
					}
				});

				console.log( 'bundle\n>\n%s\n>\n', result );
			});
		});

		// it( 'bundles modules', function () {
		// 	return esperanto.bundle({
		// 		base: 'bundle/input/1',
		// 		entry: 'foo'
		// 	}).then( function ( bundle ) {
		// 		var result = bundle.toUmd({
		// 			defaultOnly: true,
		// 			name: 'foo',
		// 			getModuleName: function ( path ) {
		// 				return path.split( '/' ).pop();
		// 			}
		// 		});

		// 		console.log( 'bundle\n>\n%s\n>\n', result );
		// 	});
		// });

		// it( 'follows /index.js paths', function () {
		// 	return esperanto.bundle({
		// 		base: 'bundle/input/2',
		// 		entry: 'foo'
		// 	}).then( function ( bundle ) {
		// 		var result = bundle.toUmd({
		// 			defaultOnly: true,
		// 			name: 'foo',
		// 			getModuleName: function ( path ) {
		// 				return path.split( '/' ).pop();
		// 			}
		// 		});

		// 		console.log( 'bundle\n>\n%s\n>\n', result );
		// 	});
		// });

		// it( 'keeps imports it can\'t resolve', function () {
		// 	return esperanto.bundle({
		// 		base: 'bundle/input/3',
		// 		entry: 'foo'
		// 	}).then( function ( bundle ) {
		// 		var result = bundle.toUmd({
		// 			defaultOnly: true,
		// 			name: 'foo',
		// 			getModuleName: function ( path ) {
		// 				return path.split( '/' ).pop();
		// 			}
		// 		});

		// 		console.log( 'bundle\n>\n%s\n>\n', result );
		// 	});
		// });
	});
};

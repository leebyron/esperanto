var path = require( 'path' ),
	sander = require( 'sander' ),
	Promise = sander.Promise;

process.chdir( __dirname );

function getModuleName ( path ) {
	return '__' + path.replace( /\.js$/, '' ).split( '/' ).pop();
}

require( './build' )().then( function ( esperanto ) {
	generateFastModeOutput();
	generateStrictModeOutput();
	generateBundleOutput();

	function generateFastModeOutput () {
		var profiles = [
			{ outputdir: 'amd', method: 'toAmd', options: { defaultOnly: true } },
			{ outputdir: 'cjs', method: 'toCjs', options: { defaultOnly: true } },
			{ outputdir: 'umd', method: 'toUmd', options: { name: 'myModule', defaultOnly: true, getModuleName: getModuleName } }
		];

		return cleanup().then( buildAll ).catch( function ( err ) {
			console.log( 'err', err );
		});

		function cleanup () {
			return sander.rimraf( '../fastMode/output' );
		}

		function buildAll () {
			return sander.lsr( '../samples' ).then( function ( sourceFiles ) {
				return Promise.all( sourceFiles.map( build ) );
			});
		}

		function build ( sourceFile ) {
			return sander.readFile( '../samples', sourceFile ).then( String ).then( function ( source ) {
				var promises = profiles.map( function ( profile ) {
					try {
						var transpiled = esperanto[ profile.method ]( source, profile.options );
						return sander.writeFile( '../fastMode/output', profile.outputdir, sourceFile, transpiled );
					} catch ( err ) {
						// some modules can't be transpiled with defaultOnly
						if ( !/defaultOnly/.test( err.message ) ) {
							setTimeout( function () { throw err; });
						}
					}
				});

				return Promise.all( promises );
			});
		}
	}

	function generateStrictModeOutput () {
		var profiles = [
			{ outputdir: 'amd', method: 'toAmd', options: { getModuleName: getModuleName } },
			{ outputdir: 'cjs', method: 'toCjs', options: { getModuleName: getModuleName } },
			{ outputdir: 'umd', method: 'toUmd', options: { name: 'myModule', getModuleName: getModuleName } }
		];

		return cleanup().then( buildAll ).catch( function ( err ) {
			console.log( 'err', err );
		});

		function cleanup () {
			return sander.rimraf( '../strictMode/output' );
		}

		function buildAll () {
			return sander.lsr( '../samples' ).then( function ( sourceFiles ) {
				return Promise.all( sourceFiles.map( build ) );
			});
		}

		function build ( sourceFile ) {
			return sander.readFile( '../samples', sourceFile ).then( String ).then( function ( source ) {
				var promises = profiles.map( function ( profile ) {
					try {
						var transpiled = esperanto[ profile.method ]( source, profile.options );
						return sander.writeFile( '../strictMode/output', profile.outputdir, sourceFile, transpiled );
					} catch ( err ) {
						// some modules can't be transpiled with defaultOnly
						if ( !/defaultOnly/.test( err.message ) ) {
							setTimeout( function () { throw err; });
						}
					}
				});

				return Promise.all( promises );
			});
		}
	}

	function generateBundleOutput () {
		var profiles = [
			{ description: 'bundle.toAmd({ defaultOnly: true })', method: 'toAmd', outputdir: 'amdDefaults', options: { defaultOnly: true } },
			{ description: 'bundle.toCjs({ defaultOnly: true })', method: 'toCjs', outputdir: 'cjsDefaults', options: { defaultOnly: true } },
			//{ description: 'bundle.toEs6({ defaultOnly: true })', method: 'toEs6', outputdir: 'es6Defaults', options: { defaultOnly: true } },
			{ description: 'bundle.toUmd({ defaultOnly: true })', method: 'toUmd', outputdir: 'umdDefaults', options: { defaultOnly: true, name: 'myModule' } },
			{ description: 'bundle.toAmd()', method: 'toAmd', outputdir: 'amd' },
			{ description: 'bundle.toCjs()', method: 'toCjs', outputdir: 'cjs' },
			//{ description: 'bundle.toEs6()', method: 'toEs6', outputdir: 'es6' },
			{ description: 'bundle.toUmd()', method: 'toUmd', outputdir: 'umd', options: { name: 'myModule' } }
		];

		return cleanup().then( buildAll ).catch( function ( err ) {
			console.log( 'err', err );
		});

		function cleanup () {
			return sander.rimraf( '../bundle/output' );
		}

		function buildAll () {
			return sander.readdir( '../bundle/input' ).then( function ( sourceBundles ) {
				return Promise.all( sourceBundles.map( build ) );
			});
		}

		function build ( sourceBundle ) {
			return esperanto.bundle({
				base: path.join( '../bundle/input', sourceBundle ),
				entry: 'main'
			}).then( function ( bundle ) {
				var promises = profiles.map( function ( profile ) {
					try {
						var transpiled = bundle[ profile.method ]( profile.options );
						return sander.writeFile( '../bundle/output', profile.outputdir, sourceBundle + '.js', transpiled );
					} catch ( err ) {
						// some modules can't be transpiled with defaultOnly
						if ( !/defaultOnly/.test( err.message ) ) {
							setTimeout( function () { throw err; });
						}
					}
				});

				return Promise.all( promises );
			});
		}
	}
}).catch( function ( err ) {
	console.log( 'err', err );
});

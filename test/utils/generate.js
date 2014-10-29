var sander = require( 'sander' );

process.chdir( __dirname );

require( './build' )().then( function ( esperanto ) {
	var sander = require( 'sander' ),
		profiles = [
			{
				outputdir: 'amd',
				method: 'toAmd',
				options: {}
			},
			{
				outputdir: 'cjs',
				method: 'toCjs',
				options: {}
			},
			{
				outputdir: 'umd',
				method: 'toUmd',
				options: { name: 'myModule' }
			},
			{
				outputdir: 'amdDefaults',
				method: 'toAmd',
				options: { defaultOnly: true }
			},
			{
				outputdir: 'cjsDefaults',
				method: 'toCjs',
				options: { defaultOnly: true }
			},
			{
				outputdir: 'umdDefaults',
				method: 'toUmd',
				options: { name: 'myModule', defaultOnly: true }
			}
		];

	return cleanup().then( buildAll ).catch( function ( err ) {
		console.log( 'err', err );
	});

	function cleanup () {
		return sander.rimraf( '../output' );
	}

	function buildAll () {
		return sander.lsr( '../input' ).then( function ( sourceFiles ) {
			return Promise.all( sourceFiles.map( build ) );
		});
	}

	function build ( sourceFile ) {
		return sander.readFile( '../input', sourceFile ).then( String ).then( function ( source ) {
			var promises = profiles.map( function ( profile ) {
				try {
					var transpiled = esperanto[ profile.method ]( source, profile.options );
					return sander.writeFile( '../output', profile.outputdir, sourceFile, transpiled );
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
}).catch( function ( err ) {
	console.log( 'err', err );
});

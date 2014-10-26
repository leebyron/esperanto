var sander = require( 'sander' );

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
				outputdir: 'amdDefaults',
				method: 'toAmd',
				options: { defaultOnly: true }
			},
			{
				outputdir: 'cjsDefaults',
				method: 'toCjs',
				options: { defaultOnly: true }
			}
		];

	return cleanup().then( buildAll );

	function cleanup () {
		return sander.rimraf( 'output' );
	}

	function buildAll () {
		return sander.lsr( 'input' ).then( function ( sourceFiles ) {
			return Promise.all( sourceFiles.map( build ) );
		});
	}

	function build ( sourceFile ) {
		return sander.readFile( 'input', sourceFile ).then( String ).then( function ( source ) {
			var promises = profiles.map( function ( profile ) {
				try {
					var transpiled = esperanto[ profile.method ]( profile.options );
					return sander.writeFile( 'output', profile.outputdir, transpiled );
				} catch ( err ) {
					// some modules can't be transpiled with defaultOnly
				}
			});

			return Promise.all( promises );
		});
	}
});

export default function ( module, options ) {
	var intro;

	if ( options.defaultOnly ) {
		intro = module.imports.map( function ( x ) {
			return ( x.specifiers.length ? 'var ' + ( x.specifiers[0].as || x.specifiers[0].name ) + ' = ' : '' ) + 'require(\'' + x.path + '\');';
		}).join( '\n' );
	} else {
		intro = module.imports.map( function ( x, i ) {
			var name = getImportName( x, i );

			return ( x.specifiers.length ? 'var ' + name + ' = ' : '' ) + 'require(\'' + x.path + '\');' + ( i === module.imports.length - 1 ? '\n' : '' );
		}).join( '\n' );

		intro += module.imports.filter( excludeBatchImports ).map( function ( x, i ) {
			var importName = '__imports_' + i;

			return x.specifiers.map( function ( specifier ) {
				return 'var ' + specifier.as + ' = ' + importName + '.' + specifier.name + ';';
			}).join( '\n' );
		}).join( '\n' );
	}

	return intro;

	function getImportName ( x, i ) {
		if ( x.specifiers[0] && x.specifiers[0].batch ) {
			return x.specifiers[0].name;
		}

		return ( options.defaultOnly && x.specifiers[0] ) ? x.specifiers[0].as : '__imports_' + i;
	}
}

function excludeBatchImports ( x ) {
	if ( x.specifiers[0] && x.specifiers[0].batch ) {
		return false;
	}

	return true;
}
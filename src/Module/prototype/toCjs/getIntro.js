import getImportReplacement from './getImportReplacement';

export default function ( module, options ) {
	var intro;

	intro = module.imports.map( ( x, i ) => {
		return getImportReplacement( x, i, options );
	}).join( '\n' );

	if ( !options.defaultOnly ) {
		intro += '\n\n' + module.imports.filter( excludeBatchImports ).map( ( x, i ) => {
			return x.specifiers.map( s => `var ${s.as} = __imports_${i}.${s.name};` ).join( '\n' );
		}).join( '\n' );
	}

	return intro;
}

function excludeBatchImports ( x ) {
	if ( x.specifiers[0] && x.specifiers[0].batch ) {
		return false;
	}

	return true;
}
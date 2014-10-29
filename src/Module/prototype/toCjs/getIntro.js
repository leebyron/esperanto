import getImportReplacement from './getImportReplacement';

export default function ( module, options ) {
	var importStatements, specifiers;

	importStatements = module.imports.map( ( x, i ) => {
		return getImportReplacement( x, i, options );
	}).join( '\n' );

	if ( !options.defaultOnly ) {
		specifiers = module.imports.filter( excludeBatchImports ).map( ( x, i ) => {
			return x.specifiers.map( s => `var ${s.as} = __imports_${i}.${s.name};` ).join( '\n' );
		}).filter( Boolean ).join( '\n' );

		return importStatements + '\n\n' + specifiers;
	}

	return importStatements;
}

function excludeBatchImports ( x ) {
	if ( x.specifiers[0] && x.specifiers[0].batch ) {
		return false;
	}

	return true;
}
import excludeBatchImports from '../shared/excludeBatchImports';

export default function getHeader ( mod, options ) {
	if ( options.defaultOnly ) {
		return '';
	}

	return mod.imports.filter( excludeBatchImports ).map( x => {
		return x.specifiers.map( s => {
			return `var ${s.as} = ${x.name}.${s.name};`;
		}).join( '\n' );
	}).join( '\n' );
}
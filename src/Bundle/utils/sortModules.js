import resolve from '../../utils/resolve';

export default function sortModules ( entry, modules ) {
	var moduleByPath = {},
		seen = {},
		ordered = [];

	modules.forEach( x => {
		moduleByPath[ x.file ] = x;
	});

	function visit ( mod ) {
		// ignore external modules, and modules we've
		// already included
		if ( !mod || seen[ mod.file ] ) {
			return;
		}

		seen[ mod.file ] = true;

		mod.imports.forEach( x => {
			var file = resolve( x.path, mod.file );
			visit( moduleByPath[ file ] );
		});

		ordered.push( mod );
	}

	visit( entry );

	return ordered;
}
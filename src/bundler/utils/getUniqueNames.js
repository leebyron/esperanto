import resolve from '../../utils/resolve';

// TODO use sensible names, inferring from defaults where poss
export default function getUniqueNames ( modules, getName ) {
	// for now...
	var names = {};

	modules.forEach( mod => {
		var name = getName( mod.id );
		mod.name = names[ mod.id ] = name;
	});

	// TODO does this belong here?
	modules.forEach( mod => {
		mod.imports.forEach( x => {
			var id = resolve( x.path, mod.file );
			x.id = id;
			x.name = getName( id );
		});
	});

	return names;
}

var template = `
(function (__export) {
__EXPORTS__;
}(function(prop,get) {
__INDENT__Object.defineProperty(exports,prop,{enumerable:true,get:get,set:function(){throw new Error('Cannot reassign imported binding of namespace \`'+prop+'\`');}});
}));`;

export default function getFooter ( mod, options, defaultLhs, defaultValue ) {
	var indent, passthroughByName;

	if ( !mod.exports.length ) {
		return '';
	}

	// In default only mode, we just do e.g. `return foo`
	if ( options.defaultOnly ) {
		return defaultLhs + mod.exports[0].value + ';';
	}

	indent = mod.body.indentStr;

	passthroughByName = {};
	mod.imports.forEach( x => {
		x.specifiers.forEach( s => {
			passthroughByName[ s.as ] = x.name + '.' + s.name;
		});
	});

	// Otherwise, we export live bindings
	return template
		.replace( '__INDENT__', indent )
		.replace( '__EXPORTS__', mod.exports.map( x => {
			if ( x.default ) {
				return '';// 'exports.default = ' + defaultValue;
			}

			if ( x.specifiers ) {
				return x.specifiers.map( s => {
					var passthrough;

					// if we have a situation like...
					//
					//     export { foo } from './bar';
					//
					// ...or...
					//
					//     import { foo } from './bar';
					//     export { foo }
					//
					// ...then we need to export `__bar.foo`, not `foo`
					if ( x.passthrough ) {
						passthrough = x.passthrough.name + '.' + s.name;
					} else {
						passthrough = passthroughByName[ s.name ];
					}

					return exporter( s.name, passthrough || s.name );
				}).join( '\n' );
			}

			if ( x.declaration ) {
				return exporter( x.name, x.name );
			}

			throw new Error( 'Unknown export type' );
		}).join( '\n' ));

	function exporter ( name, value ) {
		return indent + `__export('${name}', function(){return ${value};})`;
	}

	// return mod.exports.map( x => {
	// 	if ( x.specifiers ) {
	// 		return x.specifiers.map( s => `exports.${s.name} = ${s.name};` ).join( '\n' );
	// 	}

	// 	if ( x.declaration ) {
	// 		return `exports.${x.name} = ${x.name};`;
	// 	}

	// 	if ( x.default ) {
	// 		return `exports.default = ${x.value};`;
	// 	}

	// 	throw new Error( 'Unknown export type' );
	// }).join( '\n' );
}
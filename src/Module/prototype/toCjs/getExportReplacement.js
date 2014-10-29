export default function ( x, options ) {
	var lhs;

	// inline var/function declarations, e.g
	//
	//     export var foo = 'bar';
	//     export function baz () {...}
	//
	// ...should be replaced with
	//
	//     var foo = 'bar';
	//     exports.foo = foo;
	//
	//     function baz () {...}
	//     exports.baz = baz;
	if ( x.declaration ) {
		if ( options.defaultOnly ) {
			throw new Error( 'Named exports used in defaultOnly mode' );
		}

		return x.value + '\n' +
		       `exports.${x.name} = ${x.name};`;
	}

	// named exports, e.g.
	//
	//     export { foo, bar };
	//
	// ...should become
	//
	//     exports.foo = foo;
	//     exports.bar = bar;
	if ( x.specifiers ) {
		if ( options.defaultOnly ) {
			throw new Error( 'Named exports used in defaultOnly mode' );
		}

		return x.specifiers.map( s => `exports.${s.name} = ${s.name}` ).join( ';\n' );
	}

	// We have a default export, e.g.
	//
	//     export default foo;
	if ( options.trailingExport ) {
		// This is the last statement, and we're in defaultOnly mode
		// so we can do `module.exports = foo`
		lhs = 'module.exports';
	} else if ( options.defaultOnly ) {
		// This *isn't* the last statement, so we assign to __export
		// for now. It'll be exported later with `module.exports = __export`
		lhs = '__export';
	} else {
		// Named imports/exports are allowed, so we assign this
		// to 'default'
		lhs = `exports.default`;
	}

	return `${lhs} = ${x.value};`;
}
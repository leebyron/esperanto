import MagicString from 'magic-string';
//import replaceReferences from '../../../utils/replaceReferences';

export default function combine ( options ) {
	var getModuleName = this.getModuleName;

	options = options || {};

	var body = this.modules.map( m => {
		var modBody = m.body.clone(),
			prefix = getModuleName( m.file );

		// replaceReferences( m, modBody, {
		// 	varPrefix: prefix,
		// 	joiner: '__'
		// });

		// remove imports
		m.imports.forEach( x => {
			modBody.remove( x.start, x.next );
		});

		// remove or replace exports
		m.exports.forEach( x => {
			if ( x.default ) {
				if ( x.node.declaration ) {
					if ( x.node.declaration.type === 'Identifier' ) {
						modBody.replace( x.start, x.end, `var ${prefix}__default = ${prefix}__${x.node.declaration.name};` );
					} else {
						throw new Error( 'TODO' );
					}
				}
			}

			else {
				console.log( 'x', x );
				modBody.remove( x.start, x.end );
			}
		});

		return modBody.trim().toString();
	}).join( '\n\n' );

	this.body = new MagicString( body );
}

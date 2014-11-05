import getIntro from './getIntro';
import getHeader from '../shared/getHeader';
import getFooter from '../shared/getFooter';
import disallowNames from '../shared/disallowNames';
import removeImportsAndExports from '../shared/removeImportsAndExports';
import replaceReferences from '../../../utils/replaceReferences';

export default function strict ( mod, body, options ) {
	var intro,
		defaultValue,
		header,
		footer;

	intro = getIntro( mod, options );

	// replace all references to imported values
	if ( !options.defaultOnly ) {
		replaceReferences( mod, body );
	}

	// remove import statements...
	mod.imports.forEach( x => {
		if ( !x.passthrough ) {
			body.remove( x.start, x.next );
		}
	});

	// ...and export statements (but keep declarations)
	mod.exports.forEach( x => {
		var name;

		if ( x.default ) {
			defaultValue = body.slice( x.valueStart, x.end );
			if ( x.node.declaration && x.node.declaration.id && ( name = x.node.declaration.id.name ) ) {
				// if you have a default export like
				//
				//     export default function foo () {...}
				//
				// you need to rewrite it as
				//
				//     function foo () {...}
				//     exports.default = foo;
				//
				// as the `foo` reference may be used elsewhere
				body.replace( x.start, x.end, defaultValue + '\nexports.default = ' + name + ';' );
			} else {
				body.replace( x.start, x.end, 'exports.default = ' + defaultValue );
			}

			return;
		}

		if ( x.declaration ) {
			body.remove( x.start, x.valueStart );
		} else {
			body.remove( x.start, x.next );
		}
	});

	footer = getFooter( mod, options, 'module.exports = ', defaultValue );

	body.trim();

	intro && body.prepend( intro + '\n\n' ).trim();
	footer && body.prepend( footer + '\n\n' ).trim();
	header && body.prepend( header + '\n\n' ).trim();

	body.indent().prepend( '(function(){\n' ).append( '\n}).call(global);' );

	return body.toString();
}
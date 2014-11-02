import getIntro from './getIntro';
import getHeader from '../shared/getHeader';
import getFooter from '../shared/getFooter';
import getOutro from './getOutro';
import disallowNames from '../shared/disallowNames';

export default function Module$toStatement ( options ) {
	var body,
		intro,
		header,
		footer,
		outro;

	if ( options.defaultOnly ) {
		disallowNames( this );
	}

	body = this.body.clone();

	// get intro and outro
	if ( options.defaultOnly ) {
		var renamedImports = this.imports.filter( x => {
			// if this is an empty import, or the name derived from its
			// path matches this module's reference to it, we don't need
			// to include it in the intro/outro
			if ( !x.specifiers.length ) {
				return false;
			}

			if ( x.specifiers[0].as === x.name ) {
				return false;
			}

			return true;
		});

		var renamedImportReferences = renamedImports.map( x => x.specifiers[0].as ).join( ', ' );
		var renamedImportNames = renamedImports.map( x => x.name ).join( ', ' );

		intro = ( this.exports.length ? `var ${options.name} = ` : '' ) + `(function (${renamedImportReferences}) {`;
		outro = '}(' + renamedImportNames + '));';
	}

	else {
		throw new Error( 'TODO' );

		/*if ( options.defaultOnly || !mod.exports.length ) {
			importNames = mod.imports.map( getName ).join( ', ' );
			//return ( mod.exports.length ? `var ${options.name} = ` : '' ) + `(function (${importNames}) {`;
			intro = ( mod.exports.length ? `var ${options.name} = ` : '' ) + `(function () {`;
			//return '}(' + importNames + '));';
			outro = '}());';
		} else {
			importNames = [ 'exports' ].concat( mod.imports.map( getName ) ).join( ', ' );
			//return `var ${options.name} = {};\n(function (${importNames}) {`;
			intro = `var ${options.name} = {};\n(function () {`;
			//return '}(' + importNames + '));';
			outro = '}());';
		}

		if ( options.defaultOnly || !mod.exports.length ) {
			importNames = mod.imports.map( getName ).join( ', ' );
		} else {
			importNames = [ options.name ].concat( mod.imports.map( getName ) ).join( ', ' );
		}*/
	}

	//intro = getIntro( this, options );
	header = getHeader( this, options );
	footer = getFooter( this, options, 'return ' );
	//outro = getOutro( this, options );

	body.trim();
	header && body.prepend( header + '\n\n' ).trim();
	footer && body.append( '\n\n' + footer ).trim();

	body.indent();

	body.prepend( intro + '\n' ).trim();
	body.append( '\n' + outro ).trim();

	return body.toString();
}

function getName ( x ) {
	return x.name;
}

import getHeader from '../shared/getHeader';
import getFooter from '../shared/getFooter';
import disallowNames from '../shared/disallowNames';
import getNakedStatement from '../../../utils/getNakedStatement';

export default function Module$toStatement ( options ) {
	var body,
		nakedStatement,
		importNames,
		renamedImports,
		renamedImportReferences,
		renamedImportNames,
		intro,
		header,
		footer,
		outro;

	if ( options.defaultOnly ) {
		disallowNames( this );
	}

	body = this.body.clone();

	// Some statements don't need to be wrapped in an IIFE
	if ( nakedStatement = getNakedStatement( this, body, options ) ) {
		return nakedStatement;
	}

	// get intro and outro
	if ( options.defaultOnly ) {
		renamedImports = this.imports.filter( x => {
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

		renamedImportReferences = renamedImports.map( x => x.specifiers[0].as ).join( ', ' );
		renamedImportNames = renamedImports.map( x => x.name ).join( ', ' );

		intro = ( this.exports.length ? `var ${options.name} = ` : '' ) + `(function (${renamedImportReferences}) {`;
		outro = '}(' + renamedImportNames + '));';
	}

	else {
		if ( !this.exports.length ) {
			importNames = this.imports.map( getName ).join( ', ' );
			intro = ( this.exports.length ? `var ${options.name} = ` : '' ) + `(function () {`;
			outro = '}());';
		} else {
			importNames = [ 'exports' ].concat( this.imports.map( getName ) ).join( ', ' );
			intro = `var ${options.name} = {};\n(function () {`;
			outro = '}());';
		}
	}

	header = getHeader( this, options );
	footer = getFooter( this, options, 'return ' );

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

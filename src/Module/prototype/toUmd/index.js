import Source from '../../../Source';
import getIntro from './getIntro';
import transformSource from '../shared/transformSource';

export default function Module$toUmd ( options ) {
	var source;

	if ( !options.name ) {
		throw new Error( 'You must specify a global variable name for UMD exports' );
	}

	source = new Source( this.source );
	transformSource( source, this, options );

	source.prepend( getIntro( this, options ) );
	source.append( '\n\n}));' );

	return source.toString();
}

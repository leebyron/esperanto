import Source from '../../../Source';
import getIntro from './getIntro';
import transformSource from './transformSource';

export default function Module$toAmd ( options ) {
	var source;

	source = new Source( this.source );
	transformSource( source, this, options );

	source.prepend( getIntro( this, options ) );
	source.append( '\n\n});' );

	return source.toString();
}

import Source from '../../../Source';
import getIntro from './getIntro';
import getBody from './getBody';
import transformSource from './transformSource';

export default function Module$toAmd ( options ) {
	var source,
		intro,
		body,
		outro;

	source = new Source( this.source );

	//intro = getIntro( this, options );
	//body = getBody( this, options );
	transformSource( source, this, options );
	source.prepend( getIntro( this, options ) );
	source.append( '\n\n});' );
	//outro = '});';

	return source.toString();
}

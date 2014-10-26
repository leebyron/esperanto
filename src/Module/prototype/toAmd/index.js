import getIntro from './getIntro';
import getBody from './getBody';

export default function Module$toAmd ( options ) {
	var intro,
		body,
		outro;

	intro = getIntro( this, options );
	body = getBody( this, options );
	outro = '});';

	return [ intro, body, outro ].join( '\n\n' );
}

import getIntro from './getIntro';
import getBody from './getBody';

export default function Module$toCjs ( options ) {
	var intro,
		body;

	intro = getIntro( this, options );
	body = getBody( this, options );

	return intro + body;
}
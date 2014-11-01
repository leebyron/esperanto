import getIntro from './getIntro';
import getHeader from '../shared/getHeader';
import getFooter from '../shared/getFooter';
import disallowNames from '../shared/disallowNames';

export default function Module$toAmd ( options ) {
	var body,
		intro,
		header,
		footer;

	if ( options.defaultOnly ) {
		disallowNames( this );
	}

	body = this.body.clone();

	intro = getIntro( this, options );
	header = getHeader( this, options );
	footer = getFooter( this, options, 'module.exports = ' );

	body.trim();
	header && body.prepend( header + '\n\n' ).trim();
	footer && body.append( '\n\n' + footer ).trim();

	intro && body.prepend( intro + '\n\n' ).trim();

	if ( options.addUseStrict !== false ) {
		body.prepend( "'use strict';\n\n" );
	}

	return body.toString();
}

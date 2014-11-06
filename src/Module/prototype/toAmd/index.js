import getIntro from './getIntro';
import getHeader from '../shared/getHeader';
//import getFooter from '../shared/getFooter';
import defaults from './defaults';
import strict from './strict';

export default function Module$toAmd ( options ) {
	var body,
		intro,
		header,
		footer,
		outro;

	body = this.body.clone();

	if ( options.defaultOnly ) {
		return defaults( this, body, options );
	} else {
		return strict( this, body, options );
	}

	intro = getIntro( this, options );
	header = getHeader( this, options );
	//footer = getFooter( this, options, 'return ' );
	outro = '\n\n});';

	body.trim();
	header && body.prepend( header + '\n\n' ).trim();
	footer && body.append( '\n\n' + footer ).trim();

	if ( options.addUseStrict !== false ) {
		body.prepend( "'use strict';\n\n" ).trim();
	}

	body.indent();

	body.prepend( intro ).append( outro );

	return body.toString();
}

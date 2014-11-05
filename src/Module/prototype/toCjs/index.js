import defaults from './defaults';
import strict from './strict';

export default function Module$toCjs ( options ) {
	var body = this.body.clone();

	if ( options.defaultOnly ) {
		return defaults( this, body, options );
	} else {
		return strict( this, body, options );
	}
}

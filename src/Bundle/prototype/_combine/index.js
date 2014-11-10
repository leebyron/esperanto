import MagicString from 'magic-string';
import transformBody from './transformBody';
import annotateAst from '../../../utils/annotateAst';

export default function Bundle$_combine ( options ) {
	var getModuleName = this.getModuleName;

	options = options || {};

	var body = this.modules.map( mod => {
		var modBody = mod.body.clone(),
			prefix = getModuleName( mod.id );

		annotateAst( mod.ast );
		transformBody( this, mod, modBody, prefix );

		return modBody.toString();
	}).join( '\n\n' );

	this.body = new MagicString( body );
}

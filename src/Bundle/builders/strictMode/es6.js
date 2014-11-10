import getExportBlock from './utils/getExportBlock';

export default function es6 ( bundle, body ) {
	var importBlock;

	importBlock = bundle.externalModules.map( x => {
		return `import ${x.name}__default from '${x.path}';`;
	}).join( '\n' );

	if ( importBlock ) {
		body.prepend( importBlock + '\n\n' );
	}

	body.trim();
	return body.toString();
}

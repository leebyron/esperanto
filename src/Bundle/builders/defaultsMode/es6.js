export default function es6 ( bundle, body ) {
	var importBlock,
		entry = bundle.entryModule,
		x,
		exportStatement;

	importBlock = bundle.externalModules.map( x => {
		return `import ${x}__default from '${x}';`;
	}).join( '\n' );

	if ( importBlock ) {
		body.prepend( importBlock + '\n\n' );
	}

	if ( x = entry.exports[0] ) {
		exportStatement = 'export default ' + bundle.getModuleName( entry.file ) + '__default;';
		body.append( '\n\n' + exportStatement );
	}

	body.trim();
	return body.toString();
}
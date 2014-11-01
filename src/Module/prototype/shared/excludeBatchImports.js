export default function excludeBatchImports ( x ) {
	if ( x.specifiers[0] && x.specifiers[0].batch ) {
		return false;
	}

	return true;
}
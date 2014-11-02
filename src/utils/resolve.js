import path from 'path';

export default function resolve ( importPath, importerPath ) {
	var resolved;

	if ( importPath[0] !== '.' ) {
		resolved = importPath;
	} else {
		resolved = path.join( path.dirname( importerPath ), importPath );
	}

	if ( !/\.js$/.test( resolved ) ) {
		resolved += '.js';
	}

	return resolved;
}
import path from 'path';
import sanitize from '../../utils/sanitize';

export default function moduleNameHelper ( userFn ) {
	var nameByPath = {}, usedNames = {}, getModuleName;

	getModuleName = modulePath => {
		var parts, i, name;

		modulePath = modulePath.replace( /\.js$/, '' );

		// use existing value
		if ( name = nameByPath[ modulePath ] ) {
			return name;
		}

		// if user supplied a function, defer to it
		if ( userFn && ( name = userFn( modulePath ) ) ) {
			nameByPath[ modulePath ] = sanitize( name );
		}

		else {
			parts = modulePath.split( path.sep );
			i = parts.length;

			while ( i-- ) {
				name = sanitize( parts.slice( i ).join( '__' ) );

				if ( !usedNames[ name ] ) {
					usedNames[ name ] = true;
					nameByPath[ modulePath ] = name;

					break;
				}
			}
		}

		return nameByPath[ modulePath ];
	};

	return getModuleName;
}

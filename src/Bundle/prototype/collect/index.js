import path from 'path';
import sander from 'sander';
import Module from '../../../Module';

export default function Bundle$collect () {
	var modules = this.modules,
		moduleByPath = this.moduleByPath,
		getImportName = this.getImportName,
		baseUrl = this.baseUrl,
		externalModules = this.externalModules;

	return fetchModule( path.resolve( baseUrl, this.entry ) ).then( function () {
		modules.sort( ( a, b ) => {
			var i, importedPath;

			// if a depends on b, b must go first
			i = a.imports.length;
			while ( i-- ) {
				importedPath = resolve( a.imports[i].path, a.path, baseUrl );

				if ( b.path === importedPath ) {
					return 1;
				}
			}

			// and vice versa
			i = b.imports.length;
			while ( i-- ) {
				importedPath = resolve( b.imports[i].path, b.path, baseUrl );

				if ( a.path === importedPath ) {
					return 1;
				}
			}
		});
	});

	function fetchModule ( modulePath ) {
		if ( !/\.js$/.test( modulePath ) ) {
			modulePath += '.js';
		}

		if ( moduleByPath[ modulePath ] ) {
			return Promise.resolve( moduleByPath[ modulePath ] );
		}

		return sander.readFile( modulePath ).catch( function ( err ) {
			if ( err.code === 'ENOENT' ) {
				console.log( 'trying index.js' );
				return sander.readFile( modulePath.replace( /\.js$/, '/index.js' ) );
			}

			throw err;
		}).then( String ).then( function ( source ) {
			var module, promises;

			module = new Module({
				source: source,
				path: modulePath,
				getImportName: getImportName
			});

			moduleByPath[ modulePath ] = module;
			modules.push( module );

			promises = module.imports.map( x => {
				var importPath = resolve( x.path, modulePath, baseUrl );
				return fetchModule( importPath );
			});

			return Promise.all( promises );
		}).catch( function ( err ) {
			if ( err.code === 'ENOENT' ) {
				if ( !~externalModules.indexOf( modulePath ) ) {
					externalModules.push( modulePath );
				}
			} else {
				throw err;
			}
		});
	}
}

function resolve ( importPath, importerPath, baseUrl ) {
	if ( importPath[0] !== '.' ) {
		return path.resolve( baseUrl, importPath );
	}

	return path.resolve( path.dirname( importerPath ), importPath );
}

import sander from 'sander';
import Module from '../../../Module';
import resolve from '../../../utils/resolve';
import sortModules from '../../utils/sortModules';

export default function Bundle$collect () {
	var modules = [],
		promiseByPath = {},
		getModuleName = this.getModuleName,
		base = this.base,
		externalModules = this.externalModules;

	return fetchModule( this.entry ).then( () => {
		this.modules = sortModules( modules[0], modules );
	});

	function fetchModule ( modulePath ) {
		if ( !/\.js$/.test( modulePath ) ) {
			modulePath += '.js';
		}

		if ( !promiseByPath[ modulePath ] ) {
			promiseByPath[ modulePath ] = sander.readFile( base, modulePath ).catch( function ( err ) {
				if ( err.code === 'ENOENT' ) {
					return sander.readFile( modulePath.replace( /\.js$/, '/index.js' ) );
				}

				throw err;
			}).then( String ).then( function ( source ) {
				var module, promises;

				module = new Module({
					source: source,
					file: modulePath,
					getModuleName: getModuleName
				});

				modules.push( module );

				promises = module.imports.map( x => {
					var importPath = resolve( x.path, modulePath );
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

		return promiseByPath[ modulePath ];
	}
}

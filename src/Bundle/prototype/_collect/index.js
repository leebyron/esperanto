import sander from 'sander';
import Module from '../../../Module';
import resolve from '../../../utils/resolve';
import sortModules from '../../utils/sortModules';

export default function Bundle$_collect () {
	var entry = this.entry.replace( /\.js$/, '' ),
		modules = [],
		moduleLookup = this.moduleLookup,
		promiseByPath = {},
		getModuleName = this.getModuleName,
		base = this.base,
		externalModules = this.externalModules;

	return fetchModule( entry ).then( () => {
		this.entryModule = this.moduleLookup[ this.entry ];

		this.modules = sortModules( modules[0], modules );
		this._resolveChains();
		this._combine();
	});

	function fetchModule ( modulePath ) {
		modulePath = modulePath.replace( /\.js$/, '' );

		if ( !promiseByPath[ modulePath ] ) {
			promiseByPath[ modulePath ] = sander.readFile( base, modulePath + '.js' ).catch( function ( err ) {
				if ( err.code === 'ENOENT' ) {
					return sander.readFile( base, modulePath + '/index.js' );
				}

				throw err;
			}).then( String ).then( function ( source ) {
				var module, promises;

				module = new Module({
					source: source,
					file: modulePath,
					getModuleName: getModuleName,
					name: getModuleName( modulePath )
				});

				modules.push( module );
				moduleLookup[ modulePath ] = module;

				promises = module.imports.map( x => {
					var importPath = resolve( x.path, modulePath );

					// short-circuit cycles
					if ( promiseByPath[ importPath ] ) {
						return;
					}

					return fetchModule( importPath );
				});

				return Promise.all( promises );
			}).catch( function ( err ) {
				if ( err.code === 'ENOENT' ) {
					if ( modulePath === entry ) {
						throw new Error( 'Could not find entry module (' + entry + ')' );
					}

					if ( modulePath[0] === '.' ) {
						// we're missing a local module
						throw err;
					}

					// Most likely an external module
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

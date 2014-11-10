import sander from 'sander';
import Module from '../../../Module';
import resolve from '../../../utils/resolve';
import sortModules from '../../utils/sortModules';

var Promise = sander.Promise;

export default function Bundle$_collect () {
	var entry = this.entry.replace( /\.js$/, '' ),
		modules = [],
		moduleLookup = this.moduleLookup,
		promiseById = {},
		getModuleName = this.getModuleName,
		base = this.base,
		externalModules = this.externalModules,
		externalModuleLookup = this.externalModuleLookup;

	return fetchModule( entry ).then( () => {
		this.entryModule = this.moduleLookup[ this.entry ];

		this.modules = sortModules( modules[0], modules, moduleLookup );
		this._resolveChains();
		this._combine();
	});

	function fetchModule ( modulePath ) {
		var moduleId, moduleName;

		moduleId = modulePath.replace( /\.js$/, '' );
		modulePath = moduleId + '.js';

		moduleName = getModuleName( moduleId );

		if ( !promiseById[ moduleId ] ) {
			promiseById[ moduleId ] = sander.readFile( base, modulePath ).catch( function ( err ) {
				if ( err.code === 'ENOENT' ) {
					modulePath = modulePath.replace( /\.js$/, '/index.js' );
					return sander.readFile( base, modulePath );
				}

				throw err;
			}).then( String ).then( function ( source ) {
				var module, promises;

				module = new Module({
					source: source,
					id: moduleId,
					file: modulePath,
					name: moduleName,
					getModuleName: getModuleName
				});

				modules.push( module );
				moduleLookup[ moduleId ] = module;

				promises = module.imports.map( x => {
					var importPath = resolve( x.path, modulePath );

					// short-circuit cycles
					if ( promiseById[ importPath ] ) {
						return;
					}

					return fetchModule( importPath );
				});

				return Promise.all( promises );
			}).catch( function ( err ) {
				var externalModule;

				if ( err.code === 'ENOENT' ) {
					if ( moduleId === entry ) {
						throw new Error( 'Could not find entry module (' + entry + ')' );
					}

					// Most likely an external module
					if ( !externalModuleLookup[ moduleId ] ) {
						externalModule = {
							name: getModuleName( moduleId ),
							path: moduleId // TODO replace `path` with `id`
						};

						externalModules.push( externalModule );
						externalModuleLookup[ moduleId ] = externalModule;
					}
				} else {
					throw err;
				}
			});
		}

		return promiseById[ moduleId ];
	}
}

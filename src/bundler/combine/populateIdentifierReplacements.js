import hasOwnProp from 'utils/hasOwnProp';
import topLevelScopeConflicts from './topLevelScopeConflicts';

/**
 * Figures out which identifiers need to be rewritten within
   a bundle to avoid conflicts
 * @param {object} bundle - the bundle
 * @returns {object}
 */
export default function populateIdentifierReplacements ( bundle ) {
	// first, discover conflicts
	var conflicts = topLevelScopeConflicts( bundle );

	// then figure out what identifiers need to be created
	// for default exports
	bundle.modules.forEach( mod => {
		var prefix, x;

		prefix = bundle.uniqueNames[ mod.id ];

		if ( x = mod.defaultExport ) {
			if ( x.hasDeclaration && x.name ) {
				mod.identifierReplacements.default = hasOwnProp.call( conflicts, x.name ) || otherModulesDeclare( mod, prefix ) ?
					prefix + '__' + x.name :
					x.name;
			} else {
				mod.identifierReplacements.default = hasOwnProp.call( conflicts, prefix ) || otherModulesDeclare( mod, prefix ) ?
					prefix + '__default' :
					prefix;
			}
		}
	});

	// then determine which existing identifiers
	// need to be replaced
	bundle.modules.forEach( mod => {
		var prefix, moduleIdentifiers, x;

		prefix = bundle.uniqueNames[ mod.id ];
		moduleIdentifiers = mod.identifierReplacements;

		mod.ast._topLevelNames.forEach( n => {
			moduleIdentifiers[n] = hasOwnProp.call( conflicts, n ) ?
				prefix + '__' + n :
				n;
		});

		mod.imports.forEach( x => {
			var isExternalModule;

			if ( x.passthrough ) {
				return;
			}

			isExternalModule = hasOwnProp.call( bundle.externalModuleLookup, x.id );

			x.specifiers.forEach( s => {
				var moduleId, mod, moduleName, specifierName, replacement, hash, isChained, separatorIndex;

				moduleId = x.id;

				if ( s.isBatch ) {
					replacement = bundle.uniqueNames[ moduleId ];
				}

				else {
					specifierName = s.name;

					// If this is a chained import, get the origin
					hash = moduleId + '@' + specifierName;
					while ( hasOwnProp.call( bundle.chains, hash ) ) {
						hash = bundle.chains[ hash ];
						isChained = true;
					}

					if ( isChained ) {
						separatorIndex = hash.indexOf( '@' );
						moduleId = hash.substr( 0, separatorIndex );
						specifierName = hash.substring( separatorIndex + 1 );
					}

					moduleName = bundle.uniqueNames[ moduleId ];
					mod = bundle.moduleLookup[ moduleId ];

					if ( specifierName === 'default' ) {
						// if it's an external module, always use __default
						if ( isExternalModule ) {
							replacement = moduleName + '__default';
						}

						// We currently need to check for the existence of `mod`, because modules
						// can be skipped. Would be better to replace skipped modules with dummies
						// - see https://github.com/Rich-Harris/esperanto/issues/32
						else if ( mod ) {
							replacement = mod.identifierReplacements.default;
						}

						else {
							replacement = hasOwnProp.call( conflicts, moduleName ) || otherModulesDeclare( bundle.moduleLookup[ moduleId ], moduleName ) ?
								moduleName + '__default' :
								moduleName;
						}
					} else if ( !isExternalModule ) {
						replacement = hasOwnProp.call( conflicts, specifierName ) ?
							moduleName + '__' + specifierName :
							specifierName;
					} else {
						replacement = moduleName + '.' + specifierName;
					}
				}

				if ( replacement !== s.as ) {
					moduleIdentifiers[ s.as ] = replacement;
				}
			});
		});
	});

	function otherModulesDeclare ( mod, replacement ) {
		var i, otherMod;

		i = bundle.modules.length;
		while ( i-- ) {
			otherMod = bundle.modules[i];

			if ( mod === otherMod ) {
				continue;
			}

			if ( hasOwnProp.call( otherMod.ast._declared, replacement ) ) {
				return true;
			}
		}
	}
}
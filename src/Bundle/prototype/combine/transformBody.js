import estraverse from 'estraverse';
import disallowIllegalReassignment from '../../../utils/disallowIllegalReassignment';
import rewriteIdentifiers from '../../../utils/rewriteIdentifiers';
import gatherImports from './gatherImports';
import gatherExports from './gatherExports';

export default function transformBody ( bundle, mod, body, prefix ) {
	var scope,
		scopeNames,
		blockScope,
		importedBindings = {},
		toRewrite = {},
		readOnly = {},
		exportsToRewrite = {},
		exportNames = [],
		alreadyExported = {},
		shouldExportEarly = {},
		earlyExports,
		lateExports,
		defaultValue;

	scope = mod.ast._scope;
	blockScope = mod.ast._blockScope;

	gatherImports( mod.imports, bundle.externalModules, importedBindings, toRewrite );
	Object.keys( toRewrite ).forEach( k => readOnly[k] = toRewrite[k] );

	scope.names.forEach( n => toRewrite[n] = prefix + '__' + n );

	// remove top-level names from scope. TODO is there a cleaner way to do this?
	scopeNames = scope.names;
	scope.names = [];

	//gatherExports( mod.exports, toRewrite, prefix );
	//exportNames = getExportNames( mod.exports );

	estraverse.traverse( mod.ast, {
		enter: function ( node, parent ) {
			// we're only interested in references, not property names etc
			if ( node._skip ) return this.skip();

			if ( node._scope ) {
				scope = node._scope;
			} else if ( node._blockScope ) {
				blockScope = node._blockScope;
			}

			// Catch illegal reassignments
			disallowIllegalReassignment( node, readOnly, scope );

			// Rewrite assignments to exports
			rewriteExportAssignments( body, node, exportNames, scope, alreadyExported, ~mod.ast.body.indexOf( parent ) );

			// Rewrite import and export identifiers
			rewriteIdentifiers( body, node, toRewrite, scope );
		},

		leave: function ( node ) {
			if ( node.type === 'Program' ) {
				return;
			}

			if ( node._scope ) {
				scope = scope.parent;
			} else if ( node._blockScope ) {
				blockScope = blockScope.parent;
			}
		}
	});

	scope.names = scopeNames;

	// remove imports
	mod.imports.forEach( x => {
		body.remove( x.start, x.next );
	});

	// Remove export statements (but keep declarations)
	mod.exports.forEach( x => {
		var name;

		if ( x.default ) {
			defaultValue = body.slice( x.valueStart, x.end );
			if ( x.node.declaration && x.node.declaration.id && ( name = x.node.declaration.id.name ) ) {
				// if you have a default export like
				//
				//     export default function foo () {...}
				//
				// you need to rewrite it as
				//
				//     function foo () {...}
				//     exports.default = foo;
				//
				// as the `foo` reference may be used elsewhere
				body.replace( x.start, x.end, defaultValue + '\nvar ' + prefix + '__default = ' + prefix + '__' + name + ';' );
			} else {
				body.replace( x.start, x.end, 'var ' + prefix + '__default = ' + defaultValue );
			}

			return;
		}

		if ( x.declaration ) {
			if ( x.node.declaration.type === 'FunctionDeclaration' ) {
				shouldExportEarly[ x.node.declaration.id.name ] = true; // TODO what about `function foo () {}; export { foo }`?
			}

			body.remove( x.start, x.valueStart );
		} else {
			body.remove( x.start, x.next );
		}
	});



}

function rewriteExportAssignments ( body, node, exports, scope, alreadyExported, isTopLevelNode ) {
	var assignee, name;

	if ( node.type === 'AssignmentExpression' ) {
		assignee = node.left;
	} else if ( node.type === 'UpdateExpression' ) {
		assignee = node.argument;
	} else {
		return; // not an assignment
	}

	if ( assignee.type !== 'Identifier' ) {
		return;
	}

	name = assignee.name;
	if ( ~exports.indexOf( name ) ) {
		// special case - increment/decrement operators
		if ( node.operator === '++' || node.operator === '--' ) {
			body.replace( node.end, node.end, `, exports.${name} = ${name}` );
		} else {
			body.replace( node.start, node.start, `exports.${name} = ` );
		}

		// keep track of what we've already exported - we don't need to
		// export it again later
		if ( isTopLevelNode ) {
			alreadyExported[ name ] = true;
		}
	}
}
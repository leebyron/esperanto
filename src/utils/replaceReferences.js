import getImportReplacements from './getImportReplacements';
import getExportNames from './getExportNames';
import estraverse from 'estraverse';

export default function replaceReferences ( mod, body ) {
	var scope,
		blockScope,
		importReplacements = {},
		exportNames = [],
		alreadyExported = {},
		exportBlock,
		defaultValue;

	scope = mod.ast._scope;
	blockScope = mod.ast._blockScope;

	importReplacements = getImportReplacements( mod.imports );
	exportNames = getExportNames( mod.exports );

	// scope is now the global scope
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
			disallowIllegalReassignment( node, importReplacements, scope );

			// Rewrite assignments to exports
			rewriteExportAssignments( body, node, exportNames, scope, alreadyExported, ~mod.ast.body.indexOf( parent ) );

			// Rewrite import identifiers
			rewriteImportIdentifiers( body, node, importReplacements, scope );
		},

		leave: function ( node ) {
			if ( node._scope ) {
				scope = scope.parent;
			} else if ( node._blockScope ) {
				blockScope = blockScope.parent;
			}
		}
	});

	// Remove import statements
	mod.imports.forEach( x => {
		if ( x.passthrough ) return; // this is an `export { foo } from './bar'` statement
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
				body.replace( x.start, x.end, defaultValue + '\nexports.default = ' + name + ';' );
			} else {
				body.replace( x.start, x.end, 'exports.default = ' + defaultValue );
			}

			return;
		}

		if ( x.declaration ) {
			body.remove( x.start, x.valueStart );
		} else {
			body.remove( x.start, x.next );
		}
	});

	// Append export block (this is the same for all module types, unlike imports)
	exportBlock = [];
	exportNames.forEach( name => {
		if ( !alreadyExported[ name ] ) {
			exportBlock.push( `exports.${name} = ${name};` );
		}
	});

	if ( exportBlock.length ) {
		body.trim().append( '\n\n' + exportBlock.join( '\n' ) );
	}
}

function disallowIllegalReassignment ( node, importReplacements, scope ) {
	var assignee, name, replacement, message;

	if ( node.type === 'AssignmentExpression' ) {
		assignee = node.left;
	} else if ( node.type === 'UpdateExpression' ) {
		assignee = node.argument;
	} else {
		return; // not an assignment
	}

	if ( assignee.type === 'MemberExpression' ) {
		assignee = assignee.object;
		message = 'Cannot reassign imported binding of namespace ';
	} else {
		message = 'Cannot reassign imported binding ';
	}

	if ( assignee.type !== 'Identifier' ) {
		return; // not assigning to a binding
	}

	name = assignee.name;
	replacement = importReplacements[ name ];

	if ( !!replacement && !scope.contains( name ) ) {
		throw new Error( message + '`' + name + '`' );
	}
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

function rewriteImportIdentifiers ( body, node, importReplacements, scope ) {
	var name, replacement;

	if ( node.type === 'Identifier' ) {
		name = node.name;
		replacement = importReplacements[ name ];

		if ( replacement && !scope.contains( name ) ) {
			// rewrite
			body.replace( node.start, node.end, replacement );
		}
	}
}
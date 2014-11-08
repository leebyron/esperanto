import getImportReplacements from './getImportReplacements';
import estraverse from 'estraverse';

export default function replaceReferences ( mod, body, options ) {
	var scope, blockScope, importReplacements = {}, replaceVars = {}, joiner;

	options = options || {};
	joiner = options.joiner || '.';

	scope = mod.ast._scope;
	blockScope = mod.ast._blockScope;

	importReplacements = getImportReplacements( mod.imports );

	if ( options.varPrefix ) {
		scope.names.forEach( name => {
			replaceVars[ name ] = options.varPrefix + joiner + name;
		});

		scope.names = []; // TODO this is unclear. refactor it
	}

	// scope is now the global scope
	estraverse.traverse( mod.ast, {
		enter: function ( node, parent ) {
			var name, replacement;

			if ( node._skip ) {
				return this.skip();
			}

			if ( node._scope ) {
				scope = node._scope;
			}

			else if ( node._blockScope ) {
				blockScope = node._blockScope;
			}

			// Catch illegal reassignments
			disallowIllegalReassignment( node, importReplacements, scope );

			if ( node.type === 'Identifier' ) {
				name = node.name;
				replacement = importReplacements[ name ] || replaceVars[ name ];

				if ( replacement && !scope.contains( name ) ) {
					// rewrite
					body.replace( node.start, node.end, replacement );
				}
			}
		},

		leave: function ( node ) {
			if ( node._scope ) {
				scope = scope.parent;
			}

			else if ( node._blockScope ) {
				blockScope = blockScope.parent;
			}
		}
	});
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

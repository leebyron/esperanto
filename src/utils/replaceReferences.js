import estraverse from 'estraverse';

export default function replaceReferences ( mod, body ) {
	var scopeChain = [], scope, blockScopeChain = [], blockScope, importRefs, replacementByName;

	scope = scopeChain[0] = [];
	blockScope = blockScopeChain[0] = [];

	// First, store scope into on nodes
	estraverse.traverse( mod.ast, {
		enter: function ( node ) {
			if ( node.type === 'ImportDeclaration' ) {
				node._skip = true;
			}

			if ( node._skip ) {
				return this.skip();
			}

			if ( createsScope( node ) ) {
				node._scope = node.params.map( x => x.name ); // TODO rest params?
				node._scope.parent = scope;

				scope = node._scope;
				scopeChain.push( scope );

				// add params to scope
			}

			else if ( createsBlockScope( node ) ) {
				node._blockScope = [];
				node._blockScope.parent = blockScope;

				blockScope = node._blockScope;
				blockScopeChain.push( blockScope );
			}

			if ( declaresVar( node ) ) {
				scope.push( node.id.name );
			}

			else if ( declaresLet( node ) ) {
				blockScope.push( node.id.name );
			}

			// Make a note of which children we should skip
			if ( node.type === 'MemberExpression' && !node.computed ) {
				node.property._skip = true;
			}

			else if ( node.type === 'Property' ) {
				node.key._skip = true;
			}
		},
		leave: function ( node ) {
			if ( createsScope( node ) ) {
				scope = scopeChain.pop();
			}

			else if ( createsBlockScope( node ) ) {
				blockScope = blockScopeChain.pop();
			}
		}
	});

	importRefs = [];
	replacementByName = {};
	mod.imports.forEach( x => {
		if ( x.passthrough ) {
			return;
		}

		x.specifiers.forEach( s => {
			var ref;

			if ( s.batch ) {
				ref = s.name;
			} else {
				ref = s.as;
			}

			importRefs.push( ref );
			replacementByName[ ref ] = s.batch ? s.name : x.name + '.' + s.name;
		});
	});

	// scope is now the global scope
	estraverse.traverse( mod.ast, {
		enter: function ( node, parent ) {
			var ref, replacement;

			if ( node._skip ) {
				return this.skip();
			}

			if ( createsScope( node ) ) {
				scope = node._scope;
			}

			else if ( createsBlockScope( node ) ) {
				blockScope = node._blockScope;
			}

			// Catch illegal reassignments
			disallowIllegalReassignment( node, replacementByName, scope );

			if ( node.type === 'Identifier' ) {
				ref = node.name;
				replacement = replacementByName[ ref ];

				if ( replacement && !inScopeChain( scope, ref ) ) {
					// rewrite
					body.replace( node.start, node.end, replacement );
				}
			}
		},

		leave: function ( node ) {
			if ( createsScope( node ) ) {
				scope = scope.parent;
			}

			else if ( createsBlockScope( node ) ) {
				blockScope = blockScope.parent;
			}
		}
	});
}

function createsScope ( node ) {
	return node.type === 'FunctionExpression' || node.type === 'FunctionDeclaration';
}

function createsBlockScope ( node ) {
	return node.type === 'BlockStatement';
}

function declaresVar ( node ) {
	return node.type === 'VariableDeclarator'; // TODO const, class, function
}

function declaresLet ( node ) {
	return false; // TODO
}

function shouldSkip ( node ) {
	return false; // TODO
}

function inScopeChain ( scope, name ) {
	do {
		if ( ~scope.indexOf( name ) ) {
			return true;
		}
	} while ( scope = scope.parent );
}

function disallowIllegalReassignment ( node, replacementByName, scope ) {
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
	replacement = replacementByName[ name ];

	if ( !!replacement && !inScopeChain( scope, name ) ) {
		throw new Error( message + '`' + name + '`' );
	}
}
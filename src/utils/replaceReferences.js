import estraverse from 'estraverse';

var Scope = function ( options ) {
	options = options || {};

	this.parent = options.parent;
	this.names = options.params || [];
};

Scope.prototype = {
	add: function ( name ) {
		this.names.push( name );
	},

	contains: function ( name ) {
		if ( ~this.names.indexOf( name ) ) {
			return true;
		}

		if ( this.parent ) {
			return this.parent.contains( name );
		}

		return false;
	}
};

export default function replaceReferences ( mod, body ) {
	var scope, blockScope, importRefs, replacementByName;

	scope = new Scope();
	blockScope = new Scope();

	scope.global = true;// TMP

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
				scope = node._scope = new Scope({
					parent: scope,
					params: node.params.map( x => x.name ) // TODO rest params?
				});
			}

			else if ( createsBlockScope( node ) ) {
				blockScope = node._blockScope = new Scope({
					parent: blockScope
				});
			}

			if ( declaresVar( node ) ) {
				scope.add( node.id.name );
			}

			else if ( declaresLet( node ) ) {
				blockScope.add( node.id.name );
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
				scope = scope.parent;
			}

			else if ( createsBlockScope( node ) ) {
				blockScope = blockScope.parent;
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

				if ( replacement && !scope.contains( ref ) ) {
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

	if ( !!replacement && !scope.contains( name ) ) {
		throw new Error( message + '`' + name + '`' );
	}
}

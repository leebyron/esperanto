import processImport from './processImport';
import processExport from './processExport';

export default function Module$parse () {
	var source = this.source,
		imports = this.imports,
		exports = this.exports,
		previousDeclaration;

	this.ast.body.forEach( function ( node ) {
		var declaration;

		if ( previousDeclaration ) {
			previousDeclaration.next = node.start;

			if ( node.type !== 'EmptyStatement' ) {
				previousDeclaration = null;
			}
		}

		if ( node.type === 'ImportDeclaration' ) {
			declaration = processImport( node, source );
			imports.push( declaration );
		}

		else if ( node.type === 'ExportDeclaration' ) {
			declaration = processExport( node, source );
			exports.push( declaration );
		}

		if ( declaration ) {
			declaration.start = node.start;
			declaration.end = node.end;
			declaration.node = node;

			previousDeclaration = declaration;
		}
	});

	// catch any trailing semicolons
	if ( previousDeclaration ) {
		previousDeclaration.next = source.length;
	}
}
import processImport from '../helpers/processImport';
import processExport from '../helpers/processExport';

export default function Module$parse () {
	var source = this.source,
		imports = this.imports,
		exports = this.exports,
		previousDeclaration;

	this.ast.body.forEach( function ( node ) {
		var declaration;

		if ( previousDeclaration && node.type === 'EmptyStatement' ) {
			previousDeclaration.end = node.end;
		}

		previousDeclaration = null;

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
}
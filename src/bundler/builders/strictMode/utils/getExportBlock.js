import template from '../../../../utils/template';

var outroTemplate;

export default function getExportBlock ( entry, indentStr ) {
	var exportBlock = '', statements = [];

	// create an export block
	if ( entry.defaultExport ) {
		exportBlock = indentStr + 'exports.default = ' + entry.name + '__default;';
	}

	entry.exports.forEach( x => {
		if ( x.default ) {
			return;
		}

		if ( x.declaration ) {
			statements.push( indentStr + `__export('${x.name}', function () { return ${entry.name}__${x.name}; });`  );
		}

		else {
			x.specifiers.forEach( s => {
				statements.push( indentStr + `__export('${s.name}', function () { return ${entry.name}__${s.name}; });`  );
			});
		}
	});

	if ( statements.length ) {
		exportBlock += '\n\n' + outroTemplate({
			exportStatements: statements.join( '\n' )
		}).replace( /\t/g, indentStr );
	}

	return exportBlock.trim();
}

outroTemplate = template( `

	(function (__export) {
	<%= exportStatements %>
	}(function (prop, get) {
		Object.defineProperty(exports, prop, {
			enumerable: true,
			get: get
		});
	}));

` );

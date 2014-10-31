import Source from '../../Source';

export default function Module$toIife ( options ) {
	var source, trailingExport;

	source = new Source( this.source );

	trailingExport = options.defaultOnly && this.hasTrailingExport;
}

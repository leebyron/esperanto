export default function Bundle$toEs6 ( options ) {
	return this.modules.map( m => {
		return m.toStatement({
			defaultOnly: options.defaultOnly,
			name: this.getModuleName( m.file )
		});
	}).join( '\n\n' );
}
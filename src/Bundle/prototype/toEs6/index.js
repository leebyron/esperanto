export default function Bundle$toEs6 ( options ) {
	return this.modules.map( m => {
		return m.source.toString();
	}).join( '\n\n' );
}

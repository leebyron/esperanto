module.exports = function ( str, replacements ) {
	var i = replacements.length,
		replacement,
		pointer = str.length,
		chunks = [];

	// order first to last
	replacements.sort( function ( a, b ) {
		return a.start - b.start;
	});

	while ( i-- ) {
		replacement = replacements[i];
		chunks.push( str.slice( replacement.end, pointer ) );
		chunks.push( replacement.content );

		pointer = replacement.start;
	}

	chunks.push( str.slice( 0, pointer ) );

	return chunks.reverse().join( '' );
};
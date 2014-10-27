import guessIndent from './guessIndent';

var Source = function ( str ) {
	var chunk;

	this.str = str;
	this.indentStr = guessIndent( str );

	chunk = new Chunk({
		start: 0,
		end: str.length,
		content: str
	});

	this.chunks = [ chunk ];
};

Source.prototype = {
	append: function ( str ) {
		var chunk = new Chunk({
			start: this.str.length,
			end: this.str.length,
			content: str,
			offset: this.chunks[ this.chunks.length - 1 ].offset
		});

		this.chunks.push( chunk );
	},

	indent: function () {
		var indentStr = this.indentStr, offset = indentStr.length;

		this.chunks[0].content = indentStr + this.chunks[0].content;

		this.chunks.forEach( function ( chunk ) {
			chunk.adjust( offset );
			chunk.content = chunk.content.replace( /\n/g, function ( match ) {
				offset += indentStr.length;
				return match + indentStr;
			});
		});
	},

	prepend: function ( str ) {
		var chunk;

		adjust( this.chunks, str.length );

		chunk = new Chunk({
			start: 0,
			end: 0,
			content: str,
			offset: 0
		});

		this.chunks.unshift( chunk );
	},

	remove: function ( start, end ) {
		this.replace( start, end, '' );
	},

	replace: function ( start, end, content ) {
		var i, chunk, spliceArgs, d;

		// `start` refers to the original string. We need to
		// figure out where that is now

		i = this.chunks.length;
		while ( i-- ) {
			chunk = this.chunks[i];

			if ( start >= chunk.start && end <= chunk.end ) {
				// this is the chunk that we need to split up
				d = content.length - ( end - start );

				// we need to split this chunk up, and adjust all
				// that follow it
				if ( d ) {
					adjust( this.chunks.slice( i + 1 ), d );
				}

				spliceArgs = [ i, 1 ].concat( chunk.split( start, end, content ) );
				this.chunks.splice.apply( this.chunks, spliceArgs );

				return;
			}
		}

		throw new Error( 'no chunk found' );
	},

	toString: function () {
		return this.chunks.map( function ( chunk ) {
			return chunk.content;
		}).join( '' );
	},

	trim: function () {
		var i, chunk, match, characters = 0;

		// trim trailing whitespace
		// TODO wtf is going on here why doesn't this work
		i = this.chunks.length;
		while ( i-- ) {
			chunk = this.chunks[i];

			if ( /^\s+$/.test( chunk.content ) ) {
				this.chunks.pop();
			} else {
				match = /\s+$/.exec( chunk.content );
				if ( match ) {
					chunk.content = chunk.content.slice( 0, -match[0].length );
				}

				break;
			}
		}

		// trim leading whitespace
		while ( this.chunks.length ) {
			chunk = this.chunks[0];

			if ( /^\s*$/.test( chunk.content ) ) {
				characters += chunk.content.length;
				this.chunks.shift();
			} else {
				match = /^\s+/.exec( chunk.content );
				if ( match ) {
					chunk.content = chunk.content.substring( match[0].length );
					characters += match[0].length;
				}

				break;
			}
		}

		if ( characters ) {
			adjust( this.chunks, characters );
		}
	}
};

var Chunk = function ( options ) {
	this.start = options.start;
	this.end = options.end;
	this.content = options.content;

	this.offset = options.offset || 0;
};

Chunk.prototype = {
	adjust: function ( d ) {
		this.offset += d;
	},

	split: function ( start, end, content ) {
		var chunks = [], chunk, d;

		if ( start > this.start ) {
			// create new chunk before
			chunk = new Chunk({
				start: this.start,
				end: start,
				content: this.content.slice( 0, start - this.start ),
				offset: this.offset
			});

			chunks.push( chunk );
		}

		chunk = new Chunk({
			start: start,
			end: end,
			content: content,
			offset: this.offset
		});

		chunks.push( chunk );

		if ( end < this.end ) {
			d = content.length - ( end - start );

			chunk = new Chunk({
				start: end,
				end: this.end,
				content: this.content.substring( end - this.start ),
				offset: this.offset - d
			});

			chunks.push( chunk );
		}

		return chunks;
	}
};

function adjust ( chunks, d ) {
	chunks.forEach( function ( chunk ) {
		chunk.adjust( d );
	});
}

export default Source;
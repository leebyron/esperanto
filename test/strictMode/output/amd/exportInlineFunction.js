define(['exports'], function (exports) {

	function foo ( str ) {
		return str.toUpperCase();
	}
	
	__export('foo', function () { return foo; });

	function __export(prop, get) {
		Object.defineProperty(exports, prop, {
			enumerable: true,
			get: get,
			set: function () {
				throw new Error('Cannot reassign imported binding of namespace `' + prop + '`');
			}
		});
	}

});
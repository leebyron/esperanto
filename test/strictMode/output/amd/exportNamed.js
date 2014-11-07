define(['exports'], function (exports) {

	var foo = 'bar', answer = 42;
	
	__export('foo', function () { return foo; });
	__export('answer', function () { return answer; });

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
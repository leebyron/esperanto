(function (__export) {

  'use strict';
  
  __export('a', function () { return a; });
  __export('b', function () { return b; });
  __export('incr', function () { return incr; });
  
  /* jshint esnext:true */
  
  var a = 1;
  var b = 2;
  
  function incr() {
    var c = a++; // Capture `a++` to force us to use a temporary variable.
    b++;
  }

}).call(global, function(prop, get) {

  Object.defineProperty(exports, prop, {
    enumerable: true,
    get: get,
    set: function () {
      throw new Error('Cannot reassign imported binding of namespace `' + prop + '`');
    }
  });

});
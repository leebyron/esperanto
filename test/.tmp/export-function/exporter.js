(function (__export) {

  'use strict';
  
  __export('foo', function () { return foo; });
  
  /* jshint esnext:true */
  
  function foo() {
    return 121;
  }
  assert.equal(foo(), 121);

}).call(global, function(prop, get) {

  Object.defineProperty(exports, prop, {
    enumerable: true,
    get: get,
    set: function () {}
  });

});
(function (__export) {

  'use strict';
  
  
  __export('callsFoo', function () { return callsFoo; });
  
  function foo() {
    return 1;
  }
  exports.default = foo;
  
  function callsFoo() {
    return foo();
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
(function () {

  'use strict';

  /* jshint esnext:true */
  
  function foo() {
    return 121;
  }
  assert.equal(foo(), 121);
  
  exports.foo = foo;

}).call(global);
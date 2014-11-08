(function () {

  'use strict';

  function foo() {
    return 1;
  }
  exports.default = foo;
  
  function callsFoo() {
    return foo();
  }
  
  exports.callsFoo = callsFoo;

}).call(global);
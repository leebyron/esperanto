(function () {

  'use strict';
  
  var __imports_0 = require('./exporter');
  
  var getA = function getA() {
    var a = 2;
    return a;
  };
  
  assert.strictEqual(__imports_0.a, 1);
  assert.strictEqual(getA(), 2);

}).call(global);
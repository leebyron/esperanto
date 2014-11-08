(function () {

  'use strict';

  var __imports_0 = require('./exporter');
  var __imports_1 = require('./exporter');
  
  /* jshint esnext:true */
  
  assert.equal(__imports_0.default, 42);
  
  __imports_1.change();
  assert.equal(
    __imports_0.default,
    42,
    'default export should not be bound'
  );

}).call(global);
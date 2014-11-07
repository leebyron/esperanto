(function (__export) {

  'use strict';
  
  __export('foo', function () { return foo; });
  __export('bar', function () { return bar; });
  
  var __imports_0 = require('./exporter');
  
  /* jshint esnext:true */
  
  function foo () {
    var x = 1;
  }
  function bar () {
    /* error: type=SyntaxError message="Cannot reassign imported binding `x` at importer.js:10:3" */
    x = 1;
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
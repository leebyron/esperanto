(function (__export) {

  'use strict';
  
  __export('geta', function () { return geta; });
  __export('b', function () { return b; });
  
  var __imports_0 = require('./a');
  
  /* jshint esnext:true */
  
  function geta() {
    return __imports_0.a;
  }
  
  var b = 2;

}).call(global, function(prop, get) {

  Object.defineProperty(exports, prop, {
    enumerable: true,
    get: get,
    set: function () {
      throw new Error('Cannot reassign imported binding of namespace `' + prop + '`');
    }
  });

});
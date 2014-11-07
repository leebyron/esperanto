(function (__export) {

  'use strict';
  
  __export('getb', function () { return getb; });
  __export('a', function () { return a; });
  
  var __imports_0 = require('./b');
  
  /* jshint esnext:true */
  
  function getb() {
    return __imports_0.b;
  }
  
  var a = 1;

}).call(global, function(prop, get) {

  Object.defineProperty(exports, prop, {
    enumerable: true,
    get: get,
    set: function () {
      throw new Error('Cannot reassign imported binding of namespace `' + prop + '`');
    }
  });

});
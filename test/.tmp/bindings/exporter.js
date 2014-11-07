(function (__export) {

  'use strict';
  
  __export('count', function () { return count; });
  __export('incr', function () { return incr; });
  
  /* jshint esnext:true */
  
  var count = 0;
  
  function incr() {
    count++;
  }

}).call(global, function(prop, get) {

  Object.defineProperty(exports, prop, {
    enumerable: true,
    get: get,
    set: function () {}
  });

});
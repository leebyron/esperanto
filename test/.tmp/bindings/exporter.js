(function () {

  'use strict';

  /* jshint esnext:true */
  
  var count = 0;
  
  function incr() {
    count++, exports.count = count;
  }
  
  exports.count = count;
  exports.incr = incr;

}).call(global);
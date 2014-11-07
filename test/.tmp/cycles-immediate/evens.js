(function (__export) {

 'use strict';
 
 __export('nextEven', function () { return nextEven; });
 __export('isEven', function () { return isEven; });
 
 var __imports_0 = require('./odds');
 
 /* jshint esnext:true */
 
 var nextEven = (function() {
   return function(n) {
     var no = __imports_0.nextOdd(n);
     return (no === n + 2) ?
       no - 1 : no;
   };
 })(__imports_0.nextOdd);
 
 function isEven(n) {
   return n % 2 === 0;
 }

}).call(global, function(prop, get) {

 Object.defineProperty(exports, prop, {
  enumerable: true,
  get: get,
  set: function () {}
 });

});
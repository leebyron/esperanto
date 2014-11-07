(function (__export) {

 'use strict';
 
 __export('nextOdd', function () { return nextOdd; });
 __export('isOdd', function () { return isOdd; });
 
 var __imports_0 = require('./evens');
 
 /* jshint esnext:true */
 
 function nextOdd(n) {
   return __imports_0.isEven(n) ? n + 1 : n + 2;
 }
 
 /**
  * We go through these gymnastics to eager-bind to isEven. This is done to
  * ensure that both this module and the 'evens' module eagerly use something
  * from the other.
  */
 var isOdd = (function(isEven) {
   return function(n) {
     return !isEven(n);
   };
 })(__imports_0.isEven);

}).call(global, function(prop, get) {

 Object.defineProperty(exports, prop, {
  enumerable: true,
  get: get,
  set: function () {}
 });

});
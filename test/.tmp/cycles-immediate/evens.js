(function () {

 'use strict';

 exports.isEven = isEven;
 
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
 
 exports.nextEven = nextEven;

}).call(global);
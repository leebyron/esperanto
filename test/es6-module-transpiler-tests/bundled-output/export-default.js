(function () {

  'use strict';

  /* jshint esnext:true */
  
  var exporter__a = 42;
  
  function exporter__change() {
    exporter__a++;
  }
  
  assert.equal(exporter__a, 42);
  var exporter__default = exporter__a;
  
  // Any replacement for the `export default` above needs to happen in the same
  // location. It cannot be done, say, at the end of the file. Otherwise the new
  // value of `a` will be used and will be incorrect.
  exporter__a = 0;
  assert.equal(exporter__a, 0);

  /* jshint esnext:true */
  
  assert.equal(exporter__default, 42);
  
  exporter__change();
  assert.equal(
    exporter__default,
    42,
    'default export should not be bound'
  );

}).call(global);
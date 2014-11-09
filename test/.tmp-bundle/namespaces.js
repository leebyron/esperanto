(function () {

  'use strict';

  /* jshint esnext:true */
  
  var exporter__a = 'a';
  var exporter__b = 'b';
  var exporter__default = 'DEF';
  
  /* jshint esnext:true */
  
  assert.equal(foo['default'], 'DEF');
  assert.equal(foo.b, 'b');
  assert.equal(foo.a, 'a');
  
  var importer__keys = [];
  for (var importer__key in foo) {
    importer__keys.push(importer__key);
  }
  assert.deepEqual(importer__keys.sort(), ['a', 'b', 'default']);

}).call(global);
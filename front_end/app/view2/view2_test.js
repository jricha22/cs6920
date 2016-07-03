'use strict';

describe('myApp.view2 module', function() {

  beforeEach(module('myApp.view2'));
  var view2Ctrl;
  describe('view2 controller', function(){

    it('should have a defined controller', function($controller) {
      //spec body
      view2Ctrl = $controller('View2Ctrl');
      expect(View2Ctrl).toBeDefined();
    });

  });
});
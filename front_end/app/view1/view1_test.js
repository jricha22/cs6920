'use strict';

describe('myApp.view1 module', function() {

  var $rootScope;
  var $controller;
  var scope, ctrl;
  beforeEach(module('myApp.view1'));

  beforeEach(inject(function($injector) {

    $rootScope = $injector.get('$rootScope');
    $controller = $injector.get('$controller');
    scope = $rootScope.$new();
    ctrl = $controller('PaginationCtrl', { $scope: scope});

  }));

  describe('view1 controller', function(){

    it('should have a defined controller', function($controller) {
      var PaginationCtrl = $controller('PaginationCtrl');
      expect(PaginationCtrl).toBeDefined();
    });

  });

  describe('color checkboxes', function(){

      it('should change state', function() {
          var value1 = angular.element(by.binding('filterOptions.filterColor.Colorless'));
          var value2 = element(by.binding('filterOptions.filterColor.Black'));
          var value3 = element(by.binding('filterOptions.filterColor.Blue'));
          var value4 = element(by.binding('filterOptions.filterColor.White'));
          var value5 = element(by.binding('filterOptions.filterColor.Red'));
          var value6 = element(by.binding('filterOptions.filterColor.Green'));
    
          expect(value1.getText()).toContain('false');
          expect(value2.getText()).toContain('false');
          expect(value3.getText()).toContain('false');
          expect(value4.getText()).toContain('false');
          expect(value5.getText()).toContain('false');
          expect(value6.getText()).toContain('false');
    
          element(by.model('filterOptions.filterColor.Colorless')).click();
          element(by.model('filterOptions.filterColor.Blue')).click();
          element(by.model('filterOptions.filterColor.White')).click();
          element(by.model('filterOptions.filterColor.Green')).click();
    
          expect(value1.getText()).toContain('true');
          expect(value2.getText()).toContain('false');
          expect(value3.getText()).toContain('true');
          expect(value4.getText()).toContain('true');
          expect(value5.getText()).toContain('false');
          expect(value6.getText()).toContain('true');
      });
    });
    
    describe('mana limit number spinner', function(){

        it('should have initial value', function() {
            var value1 = element(by.binding('filterOptions.filterMana'));
            expect(value1.getText()).toContain('15');
        });

        it('should change value', function() {
            var value1 = element(by.binding('filterOptions.filterMana'));
            element(by.model('filterOptions.filterMana')).val('3');
            expect(value1.getText()).toContain('3');
        });

    });

    describe('pagination', function(){

        it('pagination buttons should update model', function() {
            var text = $('#card_browse').find('tbody tr').first().text();
            var value1 = element(by.id('pagination-next ng-scope'));
            value1.click();
            expect( $('#card_browse').find('tbody tr').all()).not.toContain(text);

            var newText = $('#card_browse').find('tbody tr').first().text();
            expect(text).not.toMatch(newText);

            value1 = element(by.id('pagination-prev ng-scope'));
            value1.click();

            expect( $('#card_browse').find('tbody tr').all()).toContain(text);

            newText = $('#card_browse').find('tbody tr').first().text();
            expect(text).toMatch(newText);
        });

    });

    describe('generateApiString function', function(){

        it('generateApiString should be default configuration', function() {

        });

        it('generateApiString should be form correct api string', function() {

        });
    });

    describe('$watch functions', function(){

        it('getPagedDataAsync called when page changed', function() {

        });

        it('getPagedDataAsync called when color checkbox checked', function() {

        });

        it('getPagedDataAsync called when mana limit spinner changed', function() {

        });

        it('getPagedDataAsync called when Name column sorted', function() {

        });
    });

    describe('generateFilterColor function', function(){

        it('return string should be blank with no colors checked', function() {

        });

        it('return string should contain black and blue', function() {

        });
    });

    describe('getPagedDataAsync function', function(){

        it('default load should have nonzero total server items', function() {

        });

    });
});
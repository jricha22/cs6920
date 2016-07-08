'use strict';

describe('myApp.view2 module', function() {

  beforeEach(module('myApp.view2'));
  var view2Ctrl;
  var pageCtrl, $scope, httpBackend;
  describe('view2 controller', function(){

    it('should have a defined controller', function($controller) {
      //spec body
      view2Ctrl = $controller('View2Ctrl');
      expect(View2Ctrl).toBeDefined();
    });

  });

  describe('Controller deck add/remove', function() {
      beforeEach(inject(function ($controller, $rootScope, $httpBackend) {
        $scope = $rootScope.$new();
        httpBackend = $httpBackend;
        httpBackend.when("GET", "/api/collect/deck/").respond({"cards": [{}, {}, {}]});
        pageCtrl = $controller('View2Ctrl', {$scope: $scope });
        httpBackend.flush();
      }));

      it('should call increment properly', function () {
          httpBackend.when("POST", "api/collect/deck-add-card/85/").respond({results: "Success!"});
          httpBackend.when("GET", "/api/collect/deck/").respond({"cards": [{}, {}, {}]});
          $scope.incrementDeck(85);
          httpBackend.flush();
          expect($scope.result).toEqual("Success!");
      });

      it('should fail increment with status 400', function () {
          httpBackend.when("POST", "api/collect/deck-add-card/85/").respond(400, '');
          httpBackend.when("GET", "/api/collect/deck/").respond({"cards": [{}, {}, {}]});
          $scope.incrementDeck(85);
          httpBackend.flush();
          expect($scope.result).toEqual("You tried to add more than four non-basic lands or you ran out of cards in your collection to add to the deck!");
      });

      it('should fail increment without status 400', function () {
          httpBackend.when("POST", "api/collect/deck-add-card/85/").respond(300, '');
          httpBackend.when("GET", "/api/collect/deck/").respond({"cards": [{}, {}, {}]});
          $scope.incrementDeck(85);
          httpBackend.flush();
          expect($scope.result).toEqual("I'm sorry, an occurred while processing your request. Please try again!");
      });

      it('should call decrement properly', function () {
          httpBackend.when("DELETE", "api/collect/deck-add-card/85/").respond({results: "Success!"});
          httpBackend.when("GET", "/api/collect/deck/").respond({"cards": [{}, {}, {}]});
          $scope.decrementDeck(85);
          httpBackend.flush();
          expect($scope.result).toEqual("Success!");
      });

      it('should fail decrement properly', function () {
          httpBackend.when("DELETE", "api/collect/deck-add-card/85/").respond(300, '');
          httpBackend.when("GET", "/api/collect/deck/").respond({"cards": [{}, {}, {}]});
          $scope.decrementDeck(85);
          httpBackend.flush();
          expect($scope.result).toEqual("I'm sorry, an occurred while processing your request. Please try again!");
      });
  });

  describe('Clear deck button', function() {
      beforeEach(inject(function ($controller, $rootScope, $httpBackend) {
          $scope = $rootScope.$new();
          httpBackend = $httpBackend;
          httpBackend.when("GET", "/api/collect/deck/").respond({"cards": [{}, {}, {}]});
          pageCtrl = $controller('View2Ctrl', {$scope: $scope});
          httpBackend.flush();
      }));

      it('should clear deck properly', function () {
          spyOn(window, 'confirm').and.callFake(function () {
            return true;
          });
          
          httpBackend.when("DELETE", "api/collect/deck/").respond({"cards": [{}]});
          httpBackend.when("GET", "/api/collect/deck/").respond({"cards": [{}, {}, {}]});
          $scope.clearDeck();
          httpBackend.flush();
          expect($scope.result).toEqual("Success!");
      });
  });
});
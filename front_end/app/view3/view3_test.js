'use strict';

describe('myApp.view3 module', function() {

  beforeEach(module('myApp.view3'));
  var view3Ctrl;
  var $scope, httpBackend;
  describe('view3 controller', function(){

    it('should have a defined controller', function($controller) {
      //spec body
      view3Ctrl = $controller('View3Ctrl');
      expect(View3Ctrl).toBeDefined();
    });

  });

  describe('Public decks view', function() {
      beforeEach(inject(function ($controller, $rootScope, $httpBackend) {
          $scope = $rootScope.$new();
          httpBackend = $httpBackend;
          httpBackend.when("GET", "api/collect/publicdeck/").respond({"results": [{}, {}, {}]});
          view3Ctrl = $controller('View3Ctrl', {$scope: $scope});
          httpBackend.flush();
      }));

      it('should show decks properly', function () {
          httpBackend.when("GET", "/api/collect/publicdeck/").respond({"results": [{}, {}, {}]});
          $scope.updatePublicDecks();
          httpBackend.flush();
          expect($scope.result).toEqual("Success!");
      });
  });
  
  describe('Selected deck view', function() {
      beforeEach(inject(function ($controller, $rootScope, $httpBackend) {
          $scope = $rootScope.$new();
          httpBackend = $httpBackend;
          httpBackend.when("GET", "api/collect/publicdeck/").respond({"results": [{}, {}, {}]});
          view3Ctrl = $controller('View3Ctrl', {$scope: $scope});
          httpBackend.flush();
      }));

      it('should get selected deck properly', function () {
          httpBackend.when("GET", "/api/collect/publicdeck/").respond({"results": [{}, {}, {}]});
          httpBackend.when("GET", "api/collect/get-public-deck/1/").respond({"results": [{}, {}, {}]});
          $scope.updatePublicDecks();
          $scope.selectDeck(1);
          httpBackend.flush();
          expect($scope.result).toEqual("Success!");
      });
    
      it('should fail with 400 properly', function () {
          httpBackend.when("GET", "/api/collect/publicdeck/").respond({"results": [{}, {}, {}]});
          httpBackend.when("GET", "api/collect/get-public-deck/100/").respond(400, 'Error Occurred');
          $scope.updatePublicDecks();
          $scope.selectDeck(100);
          httpBackend.flush();
          expect($scope.result).toEqual("Error Occurred");
      });

      it('should fail with non-400 properly', function () {
          httpBackend.when("GET", "api/collect/get-public-deck/100/").respond(500, 'Error Occurred');
          $scope.selectDeck(100);
          httpBackend.flush();
          expect($scope.result).toEqual("I'm sorry, an error occurred while processing your request. Please try again!");
      });
  });
});
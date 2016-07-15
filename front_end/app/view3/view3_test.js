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
          view3Ctrl = $controller('View3Ctrl', {$scope: $scope});
      }));

      it('should show decks properly', function () {
          httpBackend.when("GET", "/api/collect/publicdeck/?ordering=name").respond({"results": [{}, {}, {}], "count": 1});
          $scope.updatePublicDecks();
          httpBackend.flush();
          expect($scope.result).toEqual("Success!");
      });
  });
  
  describe('Selected deck view', function() {
      beforeEach(inject(function ($controller, $rootScope, $httpBackend) {
          $scope = $rootScope.$new();
          httpBackend = $httpBackend;
          view3Ctrl = $controller('View3Ctrl', {$scope: $scope});
          httpBackend.when("GET", "/api/collect/publicdeck/?ordering=name").respond({"results": [{}, {}, {}]});
          httpBackend.flush();
      }));

      it('should get selected deck properly', function () {
          httpBackend.when("GET", "/api/collect/publicdeck/?ordering=name").respond({"results": [{}, {}, {}]});
          httpBackend.when("GET", "api/collect/get-public-deck/1/").respond({"results": [{}, {}, {}]});
          $scope.updatePublicDecks();
          $scope.selectDeck(1);
          httpBackend.flush();
          expect($scope.result).toEqual("Success!");
      });
    
      it('should fail with 400 properly', function () {
          httpBackend.when("GET", "/api/collect/publicdeck/?ordering=name").respond({"results": [{}, {}, {}]});
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

  describe('public deck view sorting', function() {
      beforeEach(inject(function ($controller, $rootScope, $httpBackend) {
          $scope = $rootScope.$new();
          httpBackend = $httpBackend;
          view3Ctrl = $controller('View3Ctrl', {$scope: $scope});
          httpBackend.when("GET", "/api/collect/publicdeck/?ordering=name").respond({"results": [{}, {}, {}]});
          httpBackend.flush();
      }));

      it('should order default properly', function () {
          httpBackend.when("GET", "/api/collect/publicdeck/?ordering=name").respond({"results": [{}, {}, {}]});
          $scope.updatePublicDecks();
          httpBackend.flush();
          expect($scope.result).toEqual("Success!");
      });

      it('should order reverse name properly', function () {
          httpBackend.when("GET", "/api/collect/publicdeck/?ordering=-name").respond({"results": [{}, {}, {}]});
          $scope.sortReverse = true;
          $scope.updatePublicDecks();
          httpBackend.flush();
          expect($scope.result).toEqual("Success!");
      });

      it('should order rating properly', function () {
          httpBackend.when("GET", "/api/collect/publicdeck/?ordering=average_rating").respond({"results": [{}, {}, {}]});
          $scope.sortType = 'average_rating';
          $scope.updatePublicDecks();
          httpBackend.flush();
          expect($scope.result).toEqual("Success!");
      });

      it('should order reverse rating properly', function () {
          httpBackend.when("GET", "/api/collect/publicdeck/?ordering=-average_rating").respond({"results": [{}, {}, {}]});
          $scope.sortReverse = true;
          $scope.sortType = 'average_rating';
          $scope.updatePublicDecks();
          httpBackend.flush();
          expect($scope.result).toEqual("Success!");
      });
  });

  describe('public deck voting', function() {
      beforeEach(inject(function ($controller, $rootScope, $httpBackend) {
          $scope = $rootScope.$new();
          httpBackend = $httpBackend;
          view3Ctrl = $controller('View3Ctrl', {$scope: $scope});
          httpBackend.when("GET", "/api/collect/publicdeck/?ordering=name").respond({"results": [{}, {}, {}]});
          httpBackend.flush();
      }));

      it('should show error when voting on own deck', function () {
          httpBackend.when("POST", "api/collect/vote/1/3/").respond(400, "Cannot vote on own deck");
          $scope.current_id = 1;
          $scope.voteDeck(3);
          httpBackend.flush();
          expect($scope.result).toEqual("Cannot vote on own deck");
      });

      it('should show error for invalid vote', function () {
          httpBackend.when("POST", "api/collect/vote/1/6/").respond(400, "Invalid vote");
          $scope.current_id = 1;
          $scope.voteDeck(6);
          httpBackend.flush();
          expect($scope.result).toEqual("Invalid vote");
      });

      it('should save vote properly', function () {
          httpBackend.when("POST", "api/collect/vote/1/3/").respond({"results": [{}, {}, {}]});
          $scope.current_id = 1;
          $scope.voteDeck(3);
          httpBackend.flush();
          expect($scope.result).toEqual("Success!");
      });
  });
});
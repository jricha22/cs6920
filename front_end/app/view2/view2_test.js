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
        httpBackend.when("GET", '/api/collect/publish-deck/somerequest/').respond(200, '');
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
          expect($scope.result).toEqual("");
      });

      it('should fail increment without status 400', function () {
          httpBackend.when("POST", "api/collect/deck-add-card/85/").respond(300, '');
          httpBackend.when("GET", "/api/collect/deck/").respond({"cards": [{}, {}, {}]});
          $scope.incrementDeck(85);
          httpBackend.flush();
          expect($scope.result).toEqual("I'm sorry, an error occurred while processing your request. Please try again!");
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
          expect($scope.result).toEqual("I'm sorry, an error occurred while processing your request. Please try again!");
      });
  });

  describe('Clear deck button', function() {
      beforeEach(inject(function ($controller, $rootScope, $httpBackend) {
          $scope = $rootScope.$new();
          httpBackend = $httpBackend;
          httpBackend.when("GET", "/api/collect/deck/").respond({"cards": [{}, {}, {}]});
          httpBackend.when("GET", '/api/collect/publish-deck/somerequest/').respond(200, '');
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

  describe('Controller colors', function() {
      beforeEach(inject(function ($controller, $rootScope, $httpBackend) {
          $scope = $rootScope.$new();
          httpBackend = $httpBackend;
          httpBackend.when("GET", "/api/collect/deck/").respond({"color_spread": "Black:33, Blue:0, Colorless:0, Green:0, Red:33, White:33"});
          httpBackend.when("GET", '/api/collect/publish-deck/somerequest/').respond(200, '');
          pageCtrl = $controller('View2Ctrl', {$scope: $scope});
          httpBackend.flush();
      }));

      it('should set myColors to the list of color percentages', function () {
          httpBackend.when("GET", "/api/collect/deck/").respond({"cards": [{}, {}, {}]});
          expect($scope.myColors).toEqual("Black:33, Blue:0, Colorless:0, Green:0, Red:33, White:33");
      });
  });

    describe('Controller types', function() {
      beforeEach(inject(function ($controller, $rootScope, $httpBackend) {
          $scope = $rootScope.$new();
          httpBackend = $httpBackend;
          httpBackend.when("GET", "/api/collect/deck/").respond({"type_spread": "Land: 0, Instant: 0, Enchantment: 0, Sorcery: 25, Artifact: 0, Creature: 75, Planeswalker: 0"});
          httpBackend.when("GET", '/api/collect/publish-deck/somerequest/').respond(200, '');
          pageCtrl = $controller('View2Ctrl', {$scope: $scope});
          httpBackend.flush();
      }));

      it('should set myTypes to the list of type percentages', function () {
          httpBackend.when("GET", "/api/collect/deck/").respond({"cards": [{}, {}, {}]});
          expect($scope.myTypes).toEqual("Land: 0, Instant: 0, Enchantment: 0, Sorcery: 25, Artifact: 0, Creature: 75, Planeswalker: 0");
      });
  });

    describe('Controller manacurve', function() {
      beforeEach(inject(function ($controller, $rootScope, $httpBackend) {
          $scope = $rootScope.$new();
          httpBackend = $httpBackend;
          httpBackend.when("GET", "/api/collect/deck/").respond({"mana_curve": "1, 2, 5, 1, 4, 1, 3, 1, 5, 2"});
          httpBackend.when("GET", '/api/collect/publish-deck/somerequest/').respond(200, '');
          pageCtrl = $controller('View2Ctrl', {$scope: $scope});
          httpBackend.flush();
      }));

      it('should set myCurve for the manacurve data', function () {
          httpBackend.when("GET", "/api/collect/deck/").respond({"cards": [{}, {}, {}]});
          expect($scope.myCurve).toBeDefined();
      });
  });
    
    describe('Controller sharedeck', function() {
      beforeEach(inject(function ($controller, $rootScope, $httpBackend) {
          $scope = $rootScope.$new();
          httpBackend = $httpBackend;
          httpBackend.when("GET", "/api/collect/deck/").respond({"cards": [{}, {}, {}]});
          httpBackend.when("GET", '/api/collect/publish-deck/somerequest/').respond(200, '');
          pageCtrl = $controller('View2Ctrl', {$scope: $scope});
          httpBackend.flush();
      }));

      it('should successfully share deck', function () {
          httpBackend.when("POST", '/api/collect/publish-deck/test/', '{"name": "test"}').respond(200, '');
          $scope.deckname = "test";
          $scope.publishDeck();
          httpBackend.flush();
          expect($scope.publishresult).toEqual("Deck Successfully Published.");
      });

        it('should report error when user already has shared deck', function () {
          httpBackend.when("POST", '/api/collect/publish-deck/bad/', '{"name": "bad"}').respond(400, 'User already has a published deck! Delete old one first!');
          $scope.deckname = "bad";
          $scope.publishDeck();
          httpBackend.flush();
          expect($scope.publishresult).toEqual("User already has a published deck! Delete old one first!");
      });

      it('should successfully stop sharing deck', function () {
          httpBackend.when("DELETE", '/api/collect/publish-deck/deckname/').respond(200, 'User already has a published deck! Delete old one first!');
          $scope.stopSharingDeck();
          httpBackend.flush();
          expect($scope.publishresult).toEqual("Deck Successfully Deleted.");
      });
  });

    describe('Controller checkshareddeck', function() {
      beforeEach(inject(function ($controller, $rootScope, $httpBackend) {
          $scope = $rootScope.$new();
          httpBackend = $httpBackend;
          httpBackend.when("GET", "/api/collect/deck/").respond({"cards": [{}, {}, {}]});
          httpBackend.when("GET", '/api/collect/publish-deck/somerequest/').respond(200, '');
          pageCtrl = $controller('View2Ctrl', {$scope: $scope});
          httpBackend.flush();
      }));

      it('should return true for a shared deck', function () {
          $scope.checkForDeck();
          httpBackend.flush();
          expect($scope.deckshared).toEqual(true);
      });
  });

    describe('Controller checkshareddeck', function() {
      beforeEach(inject(function ($controller, $rootScope, $httpBackend) {
          $scope = $rootScope.$new();
          httpBackend = $httpBackend;
          httpBackend.when("GET", "/api/collect/deck/").respond({"cards": [{}, {}, {}]});
          httpBackend.when("GET", '/api/collect/publish-deck/somerequest/').respond(400, '');
          pageCtrl = $controller('View2Ctrl', {$scope: $scope});
          httpBackend.flush();
      }));

      it('should return false for deck not shared', function () {
          $scope.checkForDeck();
          httpBackend.flush();
          expect($scope.deckshared).toEqual(false);
      });
  });

});
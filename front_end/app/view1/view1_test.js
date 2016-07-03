'use strict';

describe('myApp.view1 module', function() {
  beforeEach(module('myApp.view1'));
  var pageCtrl, $scope, httpBackend;
  describe('view1 controller', function(){

    it('should have a defined controller', function($controller) {
      pageCtrl = $controller('PaginationCtrl');
      expect(PaginationCtrl).toBeDefined();
    });

  });

  describe('Controller init', function() {
      beforeEach(inject(function ($controller, $rootScope, $httpBackend) {
        $scope = $rootScope.$new();
        httpBackend = $httpBackend;
        httpBackend.when("GET", "/api/collect/card/?limit=10&offset=0&manalimit=15").respond({"results": [{}, {}, {}], "count": 3});
        httpBackend.when("GET", "/api/collect/deck/").respond({"cards": [{}, {}, {}]});
        pageCtrl = $controller('PaginationCtrl', {$scope: $scope });
        $httpBackend.flush();
      }));

      it('should have 3 cards', function () {
          expect($scope.totalServerItems).toEqual(3);
      });
  });

  describe('Controller manalimit', function() {
      beforeEach(inject(function ($controller, $rootScope, $httpBackend) {
        $scope = $rootScope.$new();
        httpBackend = $httpBackend;
        httpBackend.when("GET", "/api/collect/card/?limit=10&offset=0&manalimit=15").respond({"results": [{}, {}, {}], "count": 1});
        httpBackend.when("GET", "/api/collect/deck/").respond({"cards": [{}, {}, {}]});
        pageCtrl = $controller('PaginationCtrl', {$scope: $scope });
        httpBackend.flush();
      }));

      it('should have 1 cards with manalimit 1', function () {
          httpBackend.when("GET", "/api/collect/card/?limit=10&offset=0&manalimit=1").respond({"results": [{}], "count": 1});
          httpBackend.when("GET", "/api/collect/deck/").respond({"cards": [{}, {}, {}]});
          $scope.filterOptions.filterMana = 1;
          $scope.updateCards();
          httpBackend.flush();
          expect($scope.totalServerItems).toEqual(1);
      });
  });

  describe('Controller color filters', function() {
      beforeEach(inject(function ($controller, $rootScope, $httpBackend) {
        $scope = $rootScope.$new();
        httpBackend = $httpBackend;
        httpBackend.when("GET", "/api/collect/card/?limit=10&offset=0&manalimit=15").respond({"results": [{}, {}, {}], "count": 1});
        httpBackend.when("GET", "/api/collect/deck/").respond({"cards": [{}, {}, {}]});
        pageCtrl = $controller('PaginationCtrl', {$scope: $scope });
        httpBackend.flush();
      }));

      it('should have 2 cards with green filter', function () {
          httpBackend.when("GET", "/api/collect/card/?limit=10&offset=0&color=Green&manalimit=15").respond({"results": [{}, {}], "count": 2});
          httpBackend.when("GET", "/api/collect/deck/").respond({"cards": [{}, {}, {}]});
          $scope.filterOptions.filterColor.Green = true;
          $scope.updateCards();
          httpBackend.flush();
          expect($scope.totalServerItems).toEqual(2);
      });

      it('should have 5 cards with black filter', function () {
          httpBackend.when("GET", "/api/collect/card/?limit=10&offset=0&color=Black&manalimit=15").respond({"results": [{}, {}, {}], "count": 5});
          httpBackend.when("GET", "/api/collect/deck/").respond({"cards": [{}, {}, {}]});
          $scope.filterOptions.filterColor.Black = true;
          $scope.updateCards();
          httpBackend.flush();
          expect($scope.totalServerItems).toEqual(5);
      });

      it('should have 1 cards with white filter', function () {
          httpBackend.when("GET", "/api/collect/card/?limit=10&offset=0&color=White&manalimit=15").respond({"results": [{}], "count": 1});
          httpBackend.when("GET", "/api/collect/deck/").respond({"cards": [{}, {}, {}]});
          $scope.filterOptions.filterColor.White = true;
          $scope.updateCards();
          httpBackend.flush();
          expect($scope.totalServerItems).toEqual(1);
      });

      it('should have 6 cards with red filter', function () {
          httpBackend.when("GET", "/api/collect/card/?limit=10&offset=0&color=Red&manalimit=15").respond({"results": [{}], "count": 6});
          httpBackend.when("GET", "/api/collect/deck/").respond({"cards": [{}, {}, {}]});
          $scope.filterOptions.filterColor.Red = true;
          $scope.updateCards();
          httpBackend.flush();
          expect($scope.totalServerItems).toEqual(6);
      });

      it('should have 8 cards with blue filter', function () {
          httpBackend.when("GET", "/api/collect/card/?limit=10&offset=0&color=Blue&manalimit=15").respond({"results": [{}], "count": 8});
          httpBackend.when("GET", "/api/collect/deck/").respond({"cards": [{}, {}, {}]});
          $scope.filterOptions.filterColor.Blue = true;
          $scope.updateCards();
          httpBackend.flush();
          expect($scope.totalServerItems).toEqual(8);
      });

      it('should have 7 cards with colorless filter', function () {
          httpBackend.when("GET", "/api/collect/card/?limit=10&offset=0&color=Colorless&manalimit=15").respond({"results": [{}], "count": 7});
          httpBackend.when("GET", "/api/collect/deck/").respond({"cards": [{}, {}, {}]});
          $scope.filterOptions.filterColor.Colorless = true;
          $scope.updateCards();
          httpBackend.flush();
          expect($scope.totalServerItems).toEqual(7);
      });

      it('should have 9 cards with colorless and red filter', function () {
          httpBackend.when("GET", "/api/collect/card/?limit=10&offset=0&color=Colorless,Red&manalimit=15").respond({"results": [{}], "count": 9});
          httpBackend.when("GET", "/api/collect/deck/").respond({"cards": [{}, {}, {}]});
          $scope.filterOptions.filterColor.Colorless = true;
          $scope.filterOptions.filterColor.Red = true;
          $scope.updateCards();
          httpBackend.flush();
          expect($scope.totalServerItems).toEqual(9);
      });
  });

  describe('Controller collection filters', function() {
      beforeEach(inject(function ($controller, $rootScope, $httpBackend) {
        $scope = $rootScope.$new();
        httpBackend = $httpBackend;
        httpBackend.when("GET", "/api/collect/card/?limit=10&offset=0&manalimit=15").respond({"results": [{}, {}, {}], "count": 1});
        httpBackend.when("GET", "/api/collect/deck/").respond({"cards": [{}, {}, {}]});
        pageCtrl = $controller('PaginationCtrl', {$scope: $scope });
        httpBackend.flush();
      }));

      it('should have 0 cards with collection filter', function () {
          httpBackend.when("GET", "/api/collect/card/?limit=10&offset=0&manalimit=15&owned=true").respond({"results": [{}, {}], "count": 0});
          httpBackend.when("GET", "/api/collect/deck/").respond({"cards": [{}, {}, {}]});
          $scope.filterOptions.filterCollection = true;
          $scope.updateCards();
          httpBackend.flush();
          expect($scope.totalServerItems).toEqual(0);
      });

      it('should have 2 cards with collection filter', function () {
          httpBackend.when("GET", "/api/collect/card/?limit=10&offset=0&manalimit=15&owned=true").respond({"results": [{}, {}, {}], "count": 2});
          httpBackend.when("GET", "/api/collect/deck/").respond({"cards": [{}, {}, {}]});
          $scope.filterOptions.filterCollection = true;
          $scope.updateCards();
          httpBackend.flush();
          expect($scope.totalServerItems).toEqual(2);
      });

  });

  describe('Controller collection add/remove', function() {
      beforeEach(inject(function ($controller, $rootScope, $httpBackend) {
        $scope = $rootScope.$new();
        httpBackend = $httpBackend;
        httpBackend.when("GET", "/api/collect/card/?limit=10&offset=0&manalimit=15").respond({"results": [{}, {}, {}], "count": 1});
        httpBackend.when("GET", "/api/collect/deck/").respond({"cards": [{}, {}, {}]});
        pageCtrl = $controller('PaginationCtrl', {$scope: $scope });
        httpBackend.flush();
      }));

      it('should call increment properly', function () {
          httpBackend.when("POST", "api/collect/collection-add-card/85/").respond({results: "Success"});
          httpBackend.when("GET", "/api/collect/card/?limit=10&offset=0&manalimit=15").respond({"results": [{}, {}, {}], "count": 1});
          httpBackend.when("GET", "/api/collect/deck/").respond({"cards": [{}, {}, {}]});
          $scope.incrementCollection(85);
          httpBackend.flush();
          expect($scope.totalServerItems).toEqual(1);
      });

      it('should call decrement properly', function () {
          httpBackend.when("DELETE", "api/collect/collection-add-card/85/").respond({results: "Success"});
          httpBackend.when("GET", "/api/collect/card/?limit=10&offset=0&manalimit=15").respond({"results": [{}, {}, {}], "count": 1});
          httpBackend.when("GET", "/api/collect/deck/").respond({"cards": [{}, {}, {}]});
          $scope.decrementCollection(85);
          httpBackend.flush();
          expect($scope.totalServerItems).toEqual(1);
      });
      
  });

  describe('Controller deck add/remove', function() {
      beforeEach(inject(function ($controller, $rootScope, $httpBackend) {
        $scope = $rootScope.$new();
        httpBackend = $httpBackend;
        httpBackend.when("GET", "/api/collect/card/?limit=10&offset=0&manalimit=15").respond({"results": [{}, {}, {}], "count": 1});
        httpBackend.when("GET", "/api/collect/deck/").respond({"cards": [{}, {}, {}]});
        pageCtrl = $controller('PaginationCtrl', {$scope: $scope });
        httpBackend.flush();
      }));

      it('should call increment properly', function () {
          httpBackend.when("POST", "api/collect/deck-add-card/85/").respond({results: "Success"});
          httpBackend.when("GET", "/api/collect/card/?limit=10&offset=0&manalimit=15").respond({"results": [{}, {}, {}], "count": 1});
          httpBackend.when("GET", "/api/collect/deck/").respond({"cards": [{}, {}, {}]});
          $scope.incrementDeck(85);
          httpBackend.flush();
          expect($scope.totalServerItems).toEqual(1);
      });

      it('should call decrement properly', function () {
          httpBackend.when("DELETE", "api/collect/deck-add-card/85/").respond({results: "Success"});
          httpBackend.when("GET", "/api/collect/card/?limit=10&offset=0&manalimit=15").respond({"results": [{}, {}, {}], "count": 1});
          httpBackend.when("GET", "/api/collect/deck/").respond({"cards": [{}, {}, {}]});
          $scope.decrementDeck(85);
          httpBackend.flush();
          expect($scope.totalServerItems).toEqual(1);
      });
  });

});
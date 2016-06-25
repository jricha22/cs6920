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
        $httpBackend.when("GET", "/api/collect/card/?limit=10&offset=0&manalimit=15").respond({"results": [{}, {}, {}], "count": 3});
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
        pageCtrl = $controller('PaginationCtrl', {$scope: $scope });
        httpBackend.flush();
      }));

      it('should have 1 cards with manalimit 1', function () {
          httpBackend.when("GET", "/api/collect/card/?limit=10&offset=0&manalimit=1").respond({"results": [{}], "count": 1});
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
        pageCtrl = $controller('PaginationCtrl', {$scope: $scope });
        httpBackend.flush();
      }));

      it('should have 2 cards with green filter', function () {
          httpBackend.when("GET", "/api/collect/card/?limit=10&offset=0&color=Green&manalimit=15").respond({"results": [{}, {}], "count": 2});
          $scope.filterOptions.filterColor.Green = true;
          $scope.updateCards();
          httpBackend.flush();
          expect($scope.totalServerItems).toEqual(2);
      });

      it('should have 5 cards with black filter', function () {
          httpBackend.when("GET", "/api/collect/card/?limit=10&offset=0&color=Black&manalimit=15").respond({"results": [{}, {}, {}], "count": 5});
          $scope.filterOptions.filterColor.Black = true;
          $scope.updateCards();
          httpBackend.flush();
          expect($scope.totalServerItems).toEqual(5);
      });

      it('should have 1 cards with white filter', function () {
          httpBackend.when("GET", "/api/collect/card/?limit=10&offset=0&color=White&manalimit=15").respond({"results": [{}], "count": 1});
          $scope.filterOptions.filterColor.White = true;
          $scope.updateCards();
          httpBackend.flush();
          expect($scope.totalServerItems).toEqual(1);
      });

      it('should have 6 cards with red filter', function () {
          httpBackend.when("GET", "/api/collect/card/?limit=10&offset=0&color=Red&manalimit=15").respond({"results": [{}], "count": 6});
          $scope.filterOptions.filterColor.Red = true;
          $scope.updateCards();
          httpBackend.flush();
          expect($scope.totalServerItems).toEqual(6);
      });

      it('should have 8 cards with blue filter', function () {
          httpBackend.when("GET", "/api/collect/card/?limit=10&offset=0&color=Blue&manalimit=15").respond({"results": [{}], "count": 8});
          $scope.filterOptions.filterColor.Blue = true;
          $scope.updateCards();
          httpBackend.flush();
          expect($scope.totalServerItems).toEqual(8);
      });

      it('should have 7 cards with colorless filter', function () {
          httpBackend.when("GET", "/api/collect/card/?limit=10&offset=0&color=Colorless&manalimit=15").respond({"results": [{}], "count": 7});
          $scope.filterOptions.filterColor.Colorless = true;
          $scope.updateCards();
          httpBackend.flush();
          expect($scope.totalServerItems).toEqual(7);
      });

      it('should have 9 cards with colorless and red filter', function () {
          httpBackend.when("GET", "/api/collect/card/?limit=10&offset=0&color=Colorless,Red&manalimit=15").respond({"results": [{}], "count": 9});
          $scope.filterOptions.filterColor.Colorless = true;
          $scope.filterOptions.filterColor.Red = true;
          $scope.updateCards();
          httpBackend.flush();
          expect($scope.totalServerItems).toEqual(9);
      });
  });
});
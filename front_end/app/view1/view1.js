'use strict';

angular.module('myApp.view1', ['ngRoute', 'ngResource', 'ui.bootstrap'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'static/view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', [function() {

}])

.controller('PaginationCtrl', ['$scope', 'MTGCards', function($scope, MTGCards) {
  
  $scope.data = {};
  $scope.filteredCards = {};
  $scope.totalItems = $scope.filteredCards.length;
  $scope.currentPage = 1;
  $scope.itemsPerPage = 10;
  $scope.maxSize = 5;

  //Sorting angular variables
  $scope.sortType     = 'name';   // set the default sort type
  $scope.sortReverse  = false;    // set the default sort order
  $scope.searchCards   = '';      // set the default search/filter term

  $scope.setPage = function (pageNo) {
    $scope.currentPage = pageNo;
  };

  $scope.pageChanged = function() {
    console.log('Page changed to: ' + $scope.currentPage);
  };
  
  $scope.pageCount = Math.ceil($scope.totalItems / $scope.itemsPerPage);
  
  $scope.$watch('searchCards', function () {
		$scope.totalItems = $scope.filteredCards.length;
		$scope.pageCount = Math.ceil($scope.totalItems / $scope.itemsPerPage);
		$scope.currentPage = 1;
  }, true);

  $scope.init = function() {
      $scope.data = []
      $scope.count = MTGCards.get({lim : 1});

      $scope.count.$promise.then(function (response) {
          $scope.data = MTGCards.get({lim : response['count']});

          $scope.data.$promise.then(function (response) {
              $scope.data = response;
              $scope.totalItems = $scope.data.results.length;
          });
      });
  }

  $scope.init();
}]);

// angular-resource for getting JSON data from the MTG API
angular.module('myApp.services', ['ngResource'])
  .factory('MTGCards', function($resource){
      return $resource('/api/collect/card/?limit=:lim', {lim : '@lim'})
});
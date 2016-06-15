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
  $scope.totalItems = 10;
  $scope.currentPage = 1;
  $scope.itemsPerPage = 10;
  $scope.maxSize = 5;

  $scope.setPage = function (pageNo) {
    $scope.currentPage = pageNo;
  };

  $scope.pageChanged = function() {
    console.log('Page changed to: ' + $scope.currentPage);
  };
  
  $scope.pageCount = function () {
    return Math.ceil($scope.totalItems / $scope.itemsPerPage);
  };

    $scope.$watch('currentPage + itemsPerPage', function() {
        $scope.data = MTGCards.get();
        $scope.data.$promise.then(function (result) {
          $scope.data = result;
          $scope.totalItems = $scope.data.results.length;
          var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
          var end = begin + $scope.itemsPerPage;
          $scope.filteredCards = $scope.data.results.slice(begin, end);
        });
    })
}]);

// angular-resource for getting JSON data from the MTG API
angular.module('myApp.services', ['ngResource'])
  .factory('MTGCards', function($resource){
      //change resource url in
      return $resource('/api/collect/card/?limit=280', {})
});
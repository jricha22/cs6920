'use strict';

angular.module('myApp.view1', ['ngRoute', 'ngResource'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'static/view1/view1.html',
    controller: 'CardCtrl1'
  });
}])

.controller('View1Ctrl', [function() {

}])

.controller('CardCtrl1', ['$scope', 'MTGCards', function($scope, MTGCards) {
  // Instantiate an object to store scope data in
  $scope.data = {};

  MTGCards.get(function(response) {
    // Assign the response INSIDE the callback
    $scope.data.cards = response.results;
    console.log(response)
  });
}]);


// angular-resource for getting JSON data from the MTG API
angular.module('myApp.services', ['ngResource'])
  .factory('MTGCards', function($resource){
      //change resource url in production
    return $resource('/api/collect/card/', {})
});
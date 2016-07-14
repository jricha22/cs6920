'use strict';

angular.module('myApp.view3', ['ngRoute'])

.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/view3', {
        templateUrl: 'static/view3/view3.html',
        controller: 'View3Ctrl',
    });
}])

.controller('View3Ctrl', function($scope, $http) {
    
    $scope.current_name = "";
    $scope.sortType = 'name';
    $scope.sortReverse = false;
    
    $scope.updatePublicDecks = function () {
        var results = generateApiString();
        $http.get(results).success(function (result) {
            $scope.myDecks = result['results'];
            $scope.result = "Success!";
        }).error(function (error, status) {
            if (status === 400) {
                $scope.result = error;
            } else {
                $scope.result = "I'm sorry, an error occurred while processing your request. Please try again!";
            }
        });
    };

    $scope.updatePublicDecks();
    
    $scope.selectDeck = function (id) {
        $http({
            method: 'GET',
            url: "api/collect/get-public-deck/" + id +"/",
            data: id
        }).success(function (data) {
            $scope.myData = data['cards'];
            $scope.result = "Success!";
            $scope.current_name = data['name'];
        }).error(function (error, status) {
            if (status === 400) {
                $scope.result = error;
            } else {
                $scope.result = "I'm sorry, an error occurred while processing your request. Please try again!";
            }
        });
    };
    
    function generateApiString() {
        var results = "/api/collect/publicdeck/";
        
        if ($scope.sortReverse) {
            results += "?ordering=-" + $scope.sortType;
        }
        else {
            results += "?ordering=" + $scope.sortType;
        }

        return results;
    };
});
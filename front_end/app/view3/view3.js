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
    $scope.current_id = 0;
    $scope.sortType = "name";
    $scope.sortReverse = false;
    $scope.result = "";

    $scope.rating = 0;
    $scope.max = 5;    //max rating
    $scope.isReadonly = false;

    $scope.maxSize = 5;   //# of pagination pages shown on the bar

    $scope.pagingOptions = {
        pageSize: 10,
        currentPage: 1,
        totalServerItems: 0
    };
    
    $scope.updatePublicDecks = function () {
        var results = generateApiString();
        $http.get(results).success(function (result) {
            $scope.myDecks = result['results'];
            $scope.result = "Success!";
            $scope.pagingOptions.totalServerItems = result['count'];
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
            $scope.current_name = data['name'];
            $scope.current_id = id;
            $scope.rating = data['my_vote'];
            $scope.result = "Success!";
        }).error(function (error, status) {
            if (status === 400) {
                $scope.result = error;
            } else {
                $scope.result = "I'm sorry, an error occurred while processing your request. Please try again!";
            }
        });
    };

    $scope.voteDeck = function (vote) {
        $http({
            method: 'POST',
            url: "api/collect/vote/" + $scope.current_id + "/" + vote + "/",
            data: vote
        }).success(function (data) {
            $scope.result = "Success!";
            $scope.updatePublicDecks();
        }).error(function (error, status) {
            if (status === 400) {
                $scope.result = error;
            } else {
                $scope.result = "I'm sorry, an error occurred while processing your request. Please try again!";
            }
        });
    };

    function generateApiString() {
        var pageSize = $scope.pagingOptions.pageSize;
        var page = $scope.pagingOptions.currentPage;
        var results = "/api/collect/publicdeck/?limit=" + pageSize + "&offset=" + (page - 1) * pageSize;
        
        if ($scope.sortReverse) {
            results += "&ordering=-" + $scope.sortType;
        }
        else {
            results += "&ordering=" + $scope.sortType;
        }

        return results;
    };

    $scope.hoveringOver = function(value) {
        $scope.overStar = value;
        $scope.percent = 100 * (value / $scope.max);
    };
});
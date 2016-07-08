'use strict';

angular.module('myApp.view2', ['ngRoute'])

.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/view2', {
        templateUrl: 'static/view2/view2.html',
        controller: 'View2Ctrl',
        resolve: {
            authorize: ['$rootScope', "$window", function ($rootScope, $window) {
                if (!$rootScope.profile) {
                    $window.location.href = '/#!/login_required';
                    throw 302; // THIS ERROR as HTTP 302 Found
                    return;
                }

            }]
        }
    });
}])
.controller('View2Ctrl', function($scope, $http) {
    
    $scope.updateCards = function () {
        $http.get("/api/collect/deck/").success(function (data) {
            $scope.myData = data['cards'];
            $scope.result = "Success!";
        });
    };

    $scope.updateCards();
    
    $scope.decrementDeck = function (id) {
        $http({
                method: 'DELETE',
                url: "api/collect/deck-add-card/" + id + '/',
                data: id
        }).success(function () {
                $scope.updateCards();
                $scope.result = "";
        }).error(function (error, status) {
                if (status === 400) {
                    $scope.result = "You tried to add more than four non-basic lands or you ran out of cards in your collection to add to the deck!";
                } else {
                    $scope.result = "I'm sorry, an occurred while processing your request. Please try again!";
                }
        });
    };

    $scope.incrementDeck = function (id) {
        $http({
				method: 'POST',
				url: "api/collect/deck-add-card/" + id + '/',
				data: id
        }).success(function () {
                $scope.updateCards();
                $scope.result = "";
        }).error(function (error, status) {
                if (status === 400) {
                    $scope.result = "You tried to add more than four non-basic lands or you ran out of cards in your collection to add to the deck!";
                } else {
                    $scope.result = "I'm sorry, an occurred while processing your request. Please try again!";
                }
        });
    };

    $scope.clearDeck = function() {
        if (confirm("Are you sure you want to clear your deck?")) {
            $http({
                method: 'DELETE',
                url: "api/collect/deck/",
            }).success(function () {
                $scope.updateCards();
                $scope.result = "Success!";
            }).error(function (error, status) {
                if (status === 400) {
                    $scope.result = "You tried to add more than four non-basic lands or you ran out of cards in your collection to add to the deck!";
                } else {
                    $scope.result = "I'm sorry, an occurred while processing your request. Please try again!";
                }
            });
        }
    }
});
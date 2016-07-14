'use strict';

angular.module('myApp.view2', ['ngRoute', 'zingchart-angularjs'])

.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/view2', {
        templateUrl: 'static/view2/view2.html',
        controller: 'View2Ctrl',
    });
}])

.controller('View2Ctrl', function($scope, $http) {

    $scope.myCurve = {};

    $scope.updateCards = function () {
        $http.get("/api/collect/deck/").success(function (data) {
            $scope.myData = data['cards'];
            $scope.result = "Success!";
            $scope.myColors = data['color_spread'];
            $scope.myTypes = data['type_spread'];

            $scope.myCurve = {
                type : 'bar',
                scaleY : { label : { text : 'Number of Cards' } },
                scaleX : { values : '0:10:1', label : { text : 'Mana Cost' } },
                title: {text: 'Personal Deck Mana Curve'},
                series : [
                  { values : data['mana_curve'] }
                ]
            };

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
                    $scope.result = error;
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
                    $scope.result = error;
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
    
    $scope.publishDeck = function () {
        $http({
				url: "/api/collect/publish-deck/" + $scope.deckname + '/',
                dataType: 'json',
				method: 'POST',
				data: '{"name": "' + $scope.deckname + '"}',
                headers: {
                    "Content-Type": "application/json"
                }
        }).success(function () {
                $scope.publishresult = "Deck Successfully Published.";
                $scope.updateCards();
        }).error(function (error, status) {
                if (status === 400) {
                    $scope.publishresult = error;
                } else {
                    $scope.publishresult = "I'm sorry, an occurred while processing your request. Please try again!";
                }
        });
    }
});
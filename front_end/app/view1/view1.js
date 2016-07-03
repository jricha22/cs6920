'use strict';

angular.module('myApp.view1', ['ngRoute'])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'static/view1/view1.html',
    controller: 'PaginationCtrl'
  });
}])

.controller('PaginationCtrl', function($scope, $http) {

    $scope.filterOptions = {
        filterColor: {
            Colorless: false,
            Black : false,
            Blue : false,
            White : false,
            Red : false,
            Green : false
        },
        filterMana: 15,
        filterName: '',      // set the default search/filter term
        filterCollection: false
    };

    $scope.sortType = 'name';   // set the default sort type
    $scope.sortReverse = false;    // set the default sort order
    $scope.myData = [];
    $scope.myDeck = [];
    $scope.totalServerItems = 0;
    $scope.maxSize = 5;

    $scope.pagingOptions = {
        pageSize: 10,
        currentPage: 1
    };
    
    $scope.updateCards = function () {
        var results = generateApiString();
        $http.get(results).success(function (data) {
            $scope.myData = data.results;
            $scope.totalServerItems = data['count'];

            $http.get("/api/collect/deck/").success(function (data) {
                $scope.myDeck = data['cards'];

                angular.forEach($scope.myData, function(value1, i) {
                    angular.forEach($scope.myDeck, function(value2, j) {
                        if (value1.id === value2.id){
                            $scope.myData[i]['in_deck'] = value2['count'];
                        }
                    });
                });
            });
        });
    };

    $scope.updateCards();

    function generateApiString() {
        var pageSize = $scope.pagingOptions.pageSize;
        var page = $scope.pagingOptions.currentPage;
        var results = "/api/collect/card/?limit=" + pageSize + "&offset=" + (page - 1) * pageSize;
        
        results += generateFilterColor();

        if ($scope.filterOptions.filterMana != null) {
            results += "&manalimit=" + $scope.filterOptions.filterMana;
        }

        if ($scope.sortReverse) {
            results += "&ordering=-name"
        }

        if ($scope.filterOptions.filterCollection) {
            results += "&owned=true"
        }

        return results;
    };

    function generateFilterColor() {
        var colorSet = false;
        var optionString = "";
        angular.forEach($scope.filterOptions.filterColor,function(value, index){
            if (value) {
                if (!colorSet) {
                    colorSet = true;
                    optionString += "&color=";
                }
                optionString += index + ",";
            }
        })
        if (optionString.lastIndexOf(',') === optionString.length-1) {
            return optionString.substring(0, optionString.length-1);
        }
        return optionString;
    };

    $scope.decrementCollection = function (id) {
        $http({
				method: 'DELETE',
				url: "api/collect/collection-add-card/" + id + '/',
				data: id
        }).success(function () {
                $scope.updateCards()
        });
    };

    $scope.incrementCollection = function (id) {
        $http({
				method: 'POST',
				url: "api/collect/collection-add-card/" + id + '/',
				data: id
        }).success(function () {
                $scope.updateCards()
        });
    };

    $scope.decrementDeck = function (id) {
        $http({
				method: 'DELETE',
				url: "api/collect/deck-add-card/" + id + '/',
				data: id
        }).success(function () {
                $scope.updateCards()
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
                $scope.updateCards()
        }).error(function (error, status) {
                if (status === 400) {
                    $scope.result = "You tried to add more than four non-basic lands or you ran out of cards in your collection to add to the deck!";
                } else {
                    $scope.result = "I'm sorry, an occurred while processing your request. Please try again!";
                }
        });
    };
});
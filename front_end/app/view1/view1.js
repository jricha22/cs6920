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
            });
    };

    $scope.updateCards();

    function generateApiString() {
        var pageSize = $scope.pagingOptions.pageSize;
        var page = $scope.pagingOptions.currentPage;
        var results = "/api/collect/card/?limit=" + pageSize + "&offset=" + (page - 1) * pageSize;
        var reverseOffset = $scope.totalServerItems - page * pageSize;
        
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
});
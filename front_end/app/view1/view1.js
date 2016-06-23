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
        filterName: ''      // set the default search/filter term
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
    
    $scope.setPage = function (pageNo) {
        $scope.pagingOptions.currentPage = pageNo;
    };

    $scope.pageChanged = function() {
        console.log('Page changed to: ' + $scope.pagingOptions.currentPage);
    };
    
    $scope.setPagingData = function(data){
        $scope.myData = data.results;
        $scope.totalServerItems = data['count'];
    };

    $scope.getPagedDataAsync = function (pageSize, page) {
            var results = generateApiString(pageSize, page);
            $http.get(results).success(function (largeLoad) {
                $scope.setPagingData(largeLoad);
            });
    };

    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);

    function generateApiString(pageSize, page) {
        var results = "/api/collect/card.json/?limit=";
        var reverseOffset = $scope.totalServerItems - page * pageSize;

        if ($scope.sortReverse) {
            if (reverseOffset > 0)
                results += pageSize + "&offset=" + reverseOffset;
            else
                results += (reverseOffset+pageSize);
        } else {
            results += pageSize + "&offset=" + (page - 1) * pageSize;
        }

        results += generateFilterColor();
/*
        if ($scope.filterOptions.filterName) {
            var nameText = $scope.filterOptions.filterName;
            var ft = nameText.replace(/\s+/g, '');
            results += "&color=" + ft;
        }
 */
        if ($scope.filterOptions.filterMana != null) {
            results += "&manalimit=" + $scope.filterOptions.filterMana;
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
    
    $scope.$watch('pagingOptions', function (newVal, oldVal) {
        if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
        }
    }, true);

    $scope.$watch('filterOptions', function (newVal, oldVal) {
        if (newVal !== oldVal) {
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
        }
    }, true);

    $scope.$watch('sortReverse', function(newVal, oldVal) {
        if (newVal !== oldVal) {
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
        }
    })
});
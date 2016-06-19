'use strict';

angular.module('myApp.view1', ['ngRoute', 'ui.grid', 'ui.grid.pagination', 'ui.bootstrap'])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'static/view1/view1.html',
    controller: 'PaginationCtrl'
  });
}])

.controller('View1Ctrl', [function() {

}])

.controller('PaginationCtrl', function($scope, $http) {

    $scope.filterOptions = {
        filterColor: "",
        filterMana: "",
        searchCards: ''      // set the default search/filter term
    };

    $scope.sortType = 'name';   // set the default sort type
    $scope.sortReverse = false;    // set the default sort order
    $scope.myData = [];
    $scope.totalServerItems = 0;
    $scope.maxSize = 5;

    $scope.pagingOptions = {
        pageSizes: [10, 50, 100],
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
        $scope.myData = JSON.parse(JSON.stringify(data.results));
        $scope.totalServerItems = data['count'];
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };

    $scope.getPagedDataAsync = function (pageSize, page, colorText) {
        setTimeout(function () {
            var results = generateApiString(pageSize, page, colorText);
            $http.get(results).success(function (largeLoad) {
                $scope.setPagingData(largeLoad);
            });
        }, 100);
    };

    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);

    function generateApiString(pageSize, page, colorText) {
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
        if (colorText) {
            var ft = colorText.replace(/\s+/g, '');
            results += "&color=" + ft;
        }

        return results;
    };

    $scope.$watch('pagingOptions', function (newVal, oldVal) {
        if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterColor);
        }
    }, true);

    $scope.$watch('filterOptions', function (newVal, oldVal) {
        if (newVal !== oldVal) {
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterColor);
        }
    }, true);

    $scope.$watch('sortReverse', function(newVal, oldVal) {
        if (newVal !== oldVal) {
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterColor);
        }
    })
});
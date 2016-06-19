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

    .controller('View2Ctrl', [function () {

    }]);
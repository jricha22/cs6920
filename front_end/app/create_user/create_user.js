'use strict';

angular.module('myApp.createuser', ['ngRoute'])

    .config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
        $routeProvider.when('/create_user', {
            templateUrl: 'static/create_user/create_user.html',
            controller: 'CreateUserController',
        });
        $httpProvider.defaults.xsrfCookieName = 'csrftoken'
        $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken'
    }])

    .controller('CreateUserController', ['$rootScope', '$scope', '$http', '$route', '$location', function ($rootScope, $scope, $http, $route, $location) {

        // Use the provided data to create a user account
        // and log the user in.
        // If passwords don't match tell the user to try again
        // If the username is taken tell the user to try again
        $scope.submit = function () {

            if ($scope.password1 !== $scope.password2) {
                $scope.result = "Passwords do not match!";
                return
            }

            $http({
                url: "/api/core/create-account/",
                dataType: 'json',
                method: 'POST',
                data: '{"username": "' + $scope.username + '", "password": "' + $scope.password1 + '", "first_name": "'
                + $scope.first_name + '", "last_name": "' + $scope.last_name + '", "email": "' + $scope.email + '"}',
                headers: {
                    "Content-Type": "application/json"
                }
            }).success(function (response) {
                $rootScope.profile = response;
                $scope.$parent.first_name = $scope.first_name;
                $scope.username = null;
                $scope.password1 = null;
                $scope.password2 = null;
                $scope.first_name = null;
                $scope.last_name = null;
                $scope.email = null;
                $scope.result = null;
                
                $location.path('/view1');
            })
                .error(function (error, status) {
                    if (status === 403) {
                        $scope.result = "I'm sorry, that username is already taken. Please try a different username!";
                    } else {
                        $scope.result = "I'm sorry, an occurred while processing your request. Please try again!";
                    }
                    $scope.password1 = null;
                    $scope.password2 = null;
                });
        }
    }])

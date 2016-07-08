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
        $scope.myButton = true;

        $scope.check_all_fields = function () {

            if ($scope.password1 !== $scope.password2) {
                $scope.pwd_message = "Passwords do not match!";
                $scope.myButton = true;
                return
            } else {
                $scope.pwd_message = "";
                $scope.myButton = false;
            }

            if ($scope.username === undefined || $scope.password1 === undefined || $scope.password2 === undefined ||
                $scope.first_name === undefined || $scope.last_name === undefined || $scope.email === undefined) {
                $scope.myButton = true;
            } else {
                $scope.myButton = false;
            }

        }

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
                $rootScope.name = $rootScope.profile.first_name;
                delete $scope.username;
                delete $scope.password1;
                delete $scope.password2;
                delete $scope.first_name;
                delete $scope.last_name;
                delete $scope.email;
                delete $scope.result;
                
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

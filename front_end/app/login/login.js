'use strict';

angular.module('myApp.login', ['ngRoute'])

    .config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
        $httpProvider.defaults.xsrfCookieName = 'csrftoken'
        $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken'
    }])

    .controller('LoginController', ['$rootScope', '$scope', '$http', '$route', function ($rootScope, $scope, $http, $route) {
        // Check if the user is already logged in
        $http({
            url: "/api/core/profile/",
            dataType: 'json',
            method: 'GET',
        }).success(function (response) {
            $rootScope.profile = response;
            $rootScope.name = $rootScope.profile.first_name;
            if ($rootScope.name == "") {
                $rootScope.name = $rootScope.profile.username;
            }
        })
            .error(function (error) {

            });

        // Try to validate the credentials the user provided and 
        // set the users profile if correct. Otherwise tell the
        // user to try again
        $scope.submit = function () {
            $http({
                url: "/api/core/login/",
                dataType: 'json',
                method: 'POST',
                data: '{"username": "' + $scope.username + '", "password": "' + $scope.password + '"}',
                headers: {
                    "Content-Type": "application/json"
                }
            }).success(function (response) {
                $rootScope.profile = response;
                $rootScope.name = $rootScope.profile.first_name;
                if ($rootScope.name == "") {
                    $rootScope.name = $rootScope.profile.username;
                }
                delete $scope.username;
                delete $scope.password;
                delete $scope.result;
                $route.reload();
            })
                .error(function (error) {
                    $scope.result = "I'm sorry, that username and or password was not correct. Please try again!";
                    $scope.password = "";
                });
        }

        // Log the user out by destroying the session on the server
        $scope.logout = function () {
            $http({
                url: "/api/core/login/",
                dataType: 'json',
                method: 'DELETE',
                data: '{"username": "' + $scope.username + '", "password": "' + $scope.password + '"}',
                headers: {
                    "Content-Type": "application/json"
                }
            }).success(function (response) {
                delete $rootScope.profile;
                delete $rootScope.name;
                delete $scope.username;
                delete $scope.password;
                $route.reload();
            })
                .error(function (error) {
                    $scope.result = "You've been logged out!";
                });
        }

    }])


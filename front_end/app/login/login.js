'use strict';

angular.module('myApp.login', ['ngRoute'])

    .config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
        $httpProvider.defaults.xsrfCookieName = 'csrftoken'
        $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken'
    }])

    .controller('LoginController', ['$rootScope', '$scope', '$http', '$window', function ($rootScope, $scope, $http, $window) {
        $http({
            url: "/api/core/profile/",
            dataType: 'json',
            method: 'GET',
        }).success(function (response) {
            $rootScope.profile = response;
            $scope.first_name = $rootScope.profile.first_name;
            if ($scope.first_name == "") {
                $scope.first_name = $rootScope.profile.username;
            }
        })
            .error(function (error) {

            });

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
                $scope.first_name = $rootScope.profile.first_name;
                if ($scope.first_name == "") {
                    $scope.first_name = $rootScope.profile.username;
                }
                $scope.username = null;
                $scope.password = null;
                $scope.result = null;
                $window.location.href = '/#!/static/view1';
            })
                .error(function (error) {
                    $scope.result = "I'm sorry, that username and or password was not correct. Please try again!";
                    $scope.password = "";
                });
        }

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
                $rootScope.profile = null;
                $scope.username = null;
                $scope.password = null;
                $window.location.href = '/#!/static/view1';
            })
                .error(function (error) {
                    $scope.result = "You've been logged out!";
                });
        }

    }])


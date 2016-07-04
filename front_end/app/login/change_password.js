'use strict';

angular.module('myApp.change_password', ['ngRoute'])

    .config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
        $httpProvider.defaults.xsrfCookieName = 'csrftoken'
        $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken'
    }])

    .controller('ChangePasswordController', ['$rootScope', '$scope', '$http', '$route', '$location', '$timeout', function ($rootScope, $scope, $http, $route, $location, $timeout) {
        // Check that all fields are filled and passwords match
        $scope.myButton = true;
        $scope.changed = false;
        $scope.check_all_fields = function () {

            if ($scope.password1 !== $scope.password2) {
                $scope.pwd_message = "Passwords do not match!";
                $scope.myButton = true;
                return
            } else {
                $scope.pwd_message = "";
                $scope.myButton = false;
            }

            if ($scope.old_password === undefined || $scope.password1 === undefined || $scope.password2 === undefined ) {
                $scope.myButton = true;
            } else {
                $scope.myButton = false;
            }
        }

        // Revalidate the user and try to change their password
        $scope.submit = function () {
            $http({
                url: "/api/core/change-password/",
                dataType: 'json',
                method: 'POST',
                data: '{"old_password": "' + $scope.old_password + '", "password": "' + $scope.password1 + '"}',
                headers: {
                    "Content-Type": "application/json"
                }
            }).success(function (response) {
                $scope.old_password = null;
                $scope.password1 = null;
                $scope.password2 = null;
                $scope.changed = true;
                $scope.result = "Your password has been successfully changed."
                $timeout(reset, 5000);
            })
            .error(function (error) {
                $scope.result = "An error occurred!";
                $scope.old_password = "";
                $scope.password1 = "";
                $scope.password2 = "";
            });
        }

        function reset() {
            $scope.changed = false;
            $scope.result = null;
        }

    }])

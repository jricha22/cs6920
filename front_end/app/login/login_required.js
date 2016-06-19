'use strict';

angular.module('myApp.login_required', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/login_required', {
            templateUrl: 'static/login/login.html',
            controller: 'LoginCtrl',
        });
    }])

    .controller('LoginCtrl', [function () {

    }]);

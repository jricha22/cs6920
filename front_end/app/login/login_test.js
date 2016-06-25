'use strict';

describe('loginController', function () {
    beforeEach(module('myApp.login'));
    var controller, scope;

    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        console.log('scope1', scope);
        controller = $controller('LoginController', {
            $scope: scope
        });
    }));

    describe('login controller should have empty params', function () {
        it('sets variables ', function () {
            expect(scope).toBeDefined();
            expect(scope.username).toBeUndefined();
            expect(scope.password).toBeUndefined();
            expect(scope.result).toBeUndefined();
        });
    });
});

describe('loginController', function () {
    beforeEach(module('myApp.login'));
    var controller, scope;
    var $httpBackend;

    beforeEach(inject(function ($controller, $rootScope, $injector) {
        scope = $rootScope.$new();
        console.log('scope1', scope);
        controller = $controller('LoginController', {
            $scope: scope
        });
        $httpBackend = $injector.get('$httpBackend');
    }));

    describe('login controller should get error for bad username password', function () {
        it('sets variables ', function () {
            $httpBackend.expectGET('/api/core/profile/').respond(200, '');
            $httpBackend.flush();

            $httpBackend.expectPOST('/api/core/login/', '{"username": "undefined", "password": "undefined"}').respond(403, '');

            scope.submit();
            $httpBackend.flush();
            expect(scope.result).toEqual("I'm sorry, that username and or password was not correct. Please try again!");
        });
    });
});

describe('loginController', function () {
    beforeEach(module('myApp.login'));
    var controller, scope;
    var $httpBackend;

    beforeEach(inject(function ($controller, $rootScope, $injector) {
        scope = $rootScope.$new();
        console.log('scope1', scope);
        controller = $controller('LoginController', {
            $scope: scope
        });
        $httpBackend = $injector.get('$httpBackend');
    }));

    describe('login controller should get success with correct username and password', function () {
        it('sets variables ', function () {
            $httpBackend.expectGET('/api/core/profile/').respond(200, '');
            $httpBackend.flush();

            $httpBackend.expectPOST('/api/core/login/', '{"username": "admin", "password": "admin1234"}').respond(200, '');

            scope.username = 'admin';
            scope.password = 'admin1234';
            scope.submit();
            $httpBackend.flush();
        });
    });
});

describe('loginController', function () {
    beforeEach(module('myApp.login'));
    var controller, scope;
    var $httpBackend;

    beforeEach(inject(function ($controller, $rootScope, $injector) {
        scope = $rootScope.$new();
        console.log('scope1', scope);
        controller = $controller('LoginController', {
            $scope: scope
        });
        $httpBackend = $injector.get('$httpBackend');
    }));

    describe('login controller should get success with delete', function () {
        it('sets variables ', function () {
            $httpBackend.expectGET('/api/core/profile/').respond(200, '');
            $httpBackend.flush();
            
            $httpBackend.expectDELETE('/api/core/login/').respond(200, '');

            scope.logout();
            $httpBackend.flush();
        });
    });
});


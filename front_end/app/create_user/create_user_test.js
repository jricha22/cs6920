'use strict';

describe('CreateUserController', function () {
    beforeEach(module('myApp.createuser'));
    var controller, scope;

    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        console.log('scope1', scope);
        controller = $controller('CreateUserController', {
            $scope: scope
        });
    }));

    describe('create user controller should have empty params', function () {
        it('sets variables ', function () {
            expect(scope).toBeDefined();
            expect(scope.username).toBeUndefined();
            expect(scope.password1).toBeUndefined();
            expect(scope.password2).toBeUndefined();
            expect(scope.first_name).toBeUndefined();
            expect(scope.last_name).toBeUndefined();
            expect(scope.email).toBeUndefined();
            expect(scope.result).toBeUndefined();

        });
    });
});

describe('CreateUserController', function () {
    beforeEach(module('myApp.createuser'));
    var controller, scope;

    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        console.log('scope1', scope);
        controller = $controller('CreateUserController', {
            $scope: scope
        });
    }));

    describe('create user controller should show error for mismatched passwords', function () {
        it('sets variables ', function () {
            scope.username = "a";
            scope.first_name = "a";
            scope.last_name = "a";
            scope.email = "a@a.com"
            scope.password1 = "password1";
            scope.password2 = "password2";
            scope.check_all_fields();
            expect(scope.pwd_message).toEqual("Passwords do not match!");
        });
    });
});

describe('CreateUserController', function () {
    beforeEach(module('myApp.createuser'));
    var controller, scope;
    var $httpBackend;

    beforeEach(inject(function ($controller, $rootScope, $injector) {
        scope = $rootScope.$new();
        console.log('scope1', scope);
        controller = $controller('CreateUserController', {
            $scope: scope
        });
        $httpBackend = $injector.get('$httpBackend');
    }));

    describe('create user controller should get error missing parameters', function () {
        it('sets variables ', function () {
            $httpBackend.expectPOST('/api/core/create-account/', '{"username": "undefined", "password": "undefined", "first_name": "undefined", "last_name": "undefined", "email": "undefined"}').respond(400, '');

            scope.submit();
            $httpBackend.flush();
            expect(scope.result).toEqual("I'm sorry, an occurred while processing your request. Please try again!");
        });
    });
});

describe('CreateUserController', function () {
    beforeEach(module('myApp.createuser'));
    var controller, scope;
    var $httpBackend;

    beforeEach(inject(function ($controller, $rootScope, $injector) {
        scope = $rootScope.$new();
        console.log('scope1', scope);
        controller = $controller('CreateUserController', {
            $scope: scope
        });
        $httpBackend = $injector.get('$httpBackend');
    }));

    describe('create user controller should get 403 for username already exists', function () {
        it('sets variables ', function () {
            $httpBackend.expectPOST('/api/core/create-account/', '{"username": "undefined", "password": "undefined", "first_name": "undefined", "last_name": "undefined", "email": "undefined"}').respond(403, '');

            scope.submit();
            $httpBackend.flush();
            expect(scope.result).toEqual("I'm sorry, that username is already taken. Please try a different username!");
        });
    });
});

describe('CreateUserController', function () {
    beforeEach(module('myApp.createuser'));
    var controller, scope;
    var $httpBackend;

    beforeEach(inject(function ($controller, $rootScope, $injector) {
        scope = $rootScope.$new();
        console.log('scope1', scope);
        controller = $controller('CreateUserController', {
            $scope: scope
        });
        $httpBackend = $injector.get('$httpBackend');
    }));

    describe('create user controller should get 200 for valid new account and clear all scope variables', function () {
        it('sets variables ', function () {
            $httpBackend.expectPOST('/api/core/create-account/', '{"username": "undefined", "password": "undefined", "first_name": "undefined", "last_name": "undefined", "email": "undefined"}').respond(200, '');

            scope.submit();
            $httpBackend.flush();
            expect(scope).toBeDefined();
            expect(scope.username).toBeNull();
            expect(scope.password1).toBeNull();
            expect(scope.password2).toBeNull();
            expect(scope.first_name).toBeNull();
            expect(scope.last_name).toBeNull();
            expect(scope.email).toBeNull();
            expect(scope.result).toBeNull();
        });
    });
});

describe('CreateUserController', function () {
    beforeEach(module('myApp.createuser'));
    var controller, scope;

    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        console.log('scope1', scope);
        controller = $controller('CreateUserController', {
            $scope: scope
        });
    }));

    describe('create user controller start with submit button disabled', function () {
        it('sets variable myButton to true ', function () {
            expect(scope.myButton).toBeTruthy();
        });
    });
});

describe('CreateUserController', function () {
    beforeEach(module('myApp.createuser'));
    var controller, scope;

    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        console.log('scope1', scope);
        controller = $controller('CreateUserController', {
            $scope: scope
        });
    }));

    describe('create user controller should enable button when all fields are complete', function () {
        it('sets variable myButton to false ', function () {
            scope.username = "a";
            scope.password1 = "a";
            scope.password2 = "a";
            scope.first_name = "a";
            scope.last_name = "a";
            scope.email = "a@a.com"
            scope.check_all_fields();
            expect(scope.myButton).toBeFalsy();
        });
    });
});

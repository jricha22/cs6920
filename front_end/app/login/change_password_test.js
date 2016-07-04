'use strict';

describe('ChangePasswordController', function () {
    beforeEach(module('myApp.change_password'));
    var controller, scope;

    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        console.log('scope1', scope);
        controller = $controller('ChangePasswordController', {
            $scope: scope
        });
    }));

    describe('create user controller should have empty params', function () {
        it('sets variables ', function () {
            expect(scope).toBeDefined();
            expect(scope.old_password).toBeUndefined();
            expect(scope.password1).toBeUndefined();
            expect(scope.password2).toBeUndefined();
            expect(scope.result).toBeUndefined();

        });
    });
});

describe('ChangePasswordController', function () {
    beforeEach(module('myApp.change_password'));
    var controller, scope;

    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        console.log('scope1', scope);
        controller = $controller('ChangePasswordController', {
            $scope: scope
        });
    }));

    describe('change password controller should show error for mismatched passwords', function () {
        it('sets variables ', function () {
            scope.password1 = "password1";
            scope.password2 = "password2";
            scope.check_all_fields();
            expect(scope.pwd_message).toEqual("Passwords do not match!");
        });
    });
});

describe('ChangePasswordController', function () {
    beforeEach(module('myApp.change_password'));
    var controller, scope;
    var $httpBackend;

    beforeEach(inject(function ($controller, $rootScope, $injector) {
        scope = $rootScope.$new();
        console.log('scope1', scope);
        controller = $controller('ChangePasswordController', {
            $scope: scope
        });
        $httpBackend = $injector.get('$httpBackend');
    }));

    describe('change password controller should get error missing parameters', function () {
        it('sets variables ', function () {
            $httpBackend.expectPOST('/api/core/change-password/', '{"old_password": "undefined", "password": "undefined"}').respond(400, '');

            scope.submit();
            $httpBackend.flush();
            expect(scope.result).toEqual("An error occurred!");
        });
    });
});

describe('ChangePasswordController', function () {
    beforeEach(module('myApp.change_password'));
    var controller, scope;
    var $httpBackend;

    beforeEach(inject(function ($controller, $rootScope, $injector) {
        scope = $rootScope.$new();
        console.log('scope1', scope);
        controller = $controller('ChangePasswordController', {
            $scope: scope
        });
        $httpBackend = $injector.get('$httpBackend');
    }));

    describe('change password controller should get 403 for invalid old password', function () {
        it('sets variables ', function () {
            $httpBackend.expectPOST('/api/core/change-password/', '{"old_password": "undefined", "password": "undefined"}').respond(403, '');

            scope.submit();
            $httpBackend.flush();
            expect(scope.result).toEqual("An error occurred!");
        });
    });
});

describe('ChangePasswordController', function () {
    beforeEach(module('myApp.change_password'));
    var controller, scope;
    var $httpBackend;

    beforeEach(inject(function ($controller, $rootScope, $injector) {
        scope = $rootScope.$new();
        console.log('scope1', scope);
        controller = $controller('ChangePasswordController', {
            $scope: scope
        });
        $httpBackend = $injector.get('$httpBackend');
    }));

    describe('change user controller should get 200 for valid password and clear all scope variables', function () {
        it('sets variables ', function () {
            $httpBackend.expectPOST('/api/core/change-password/', '{"old_password": "undefined", "password": "undefined"}').respond(200, '');

            scope.submit();
            $httpBackend.flush();
            expect(scope).toBeDefined();
            expect(scope.old_password).toBeNull();
            expect(scope.password1).toBeNull();
            expect(scope.password2).toBeNull();
            expect(scope.result).toEqual("Your password has been successfully changed.");
        });
    });
});

describe('ChangePasswordController', function () {
    beforeEach(module('myApp.change_password'));
    var controller, scope;

    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        console.log('scope1', scope);
        controller = $controller('ChangePasswordController', {
            $scope: scope
        });
    }));

    describe('change password controller start with submit button disabled', function () {
        it('sets variable myButton to true ', function () {
            expect(scope.myButton).toBeTruthy();
        });
    });
});

describe('ChangePasswordController', function () {
    beforeEach(module('myApp.change_password'));
    var controller, scope;

    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        console.log('scope1', scope);
        controller = $controller('ChangePasswordController', {
            $scope: scope
        });
    }));

    describe('change password controller should enable button when all fields are complete', function () {
        it('sets variable myButton to false ', function () {
            scope.old_password = "a";
            scope.password1 = "a";
            scope.password2 = "a";
            scope.check_all_fields();
            expect(scope.myButton).toBeFalsy();
        });
    });
});

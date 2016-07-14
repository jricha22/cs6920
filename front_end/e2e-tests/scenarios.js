'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('my app', function() {
  
  it('should automatically redirect to /view1 when location hash/fragment is empty', function() {
    browser.get('');
    expect(browser.getLocationAbsUrl()).toMatch("/view1");
  });


  describe('view1', function() {

    beforeEach(function() {
      browser.get('#!/view1');
    });
    
    it('should render view1 when user navigates to /view1', function() {
      //expect(element.all(by.css('[ng-view] p')).first().getText()).
      //  toMatch(/partial for view 1/);
      expect(element.all(by.css('[ng-view] h3')).first().getText()).
        toMatch(/Magic:The Gathering Card Search/);
    });

  });


  describe('view2', function() {

    beforeEach(function() {
      browser.get('#!/view2');
    });

    it('should render view2 when user navigates to /view2 while logged out', function() {
      expect(element.all(by.css('[ng-view] h3')).first().getText()).
        toMatch('Personal Deck');
    });

  });

  describe('login', function() {

    beforeEach(function() {
      browser.get('#!/');
    });
    
    it('should render login when user navigates to /', function() {
      expect(element.all(by.id('login')).first().getText()).
        toMatch(/Login/);
    });

  });

  describe('bad login', function() {

    beforeEach(function() {
      browser.get('#!/');
      element.all(by.id('login')).click();
      element.all(by.id("username")).sendKeys("admin");
      element.all(by.id("password")).sendKeys("admin");
      element.all(by.id("signin")).click();
    });

    it('should tell the user to try again', function() {
      expect(element.all(by.id('my_error')).first().getText()).
        toMatch(/I'm sorry, that username and or password was not correct. Please try again!/);
    });

  });

    describe('logout', function() {

    beforeEach(function() {
      browser.get('#!/');
      element.all(by.id('login')).click();
      element.all(by.id("username")).sendKeys("admin");
      element.all(by.id("password")).sendKeys("admin1234");
      element.all(by.id("signin")).click();
    });

    it('should render logout after user logs in', function() {
      expect(element.all(by.id('logout')).first().getText()).
        toMatch(/Logout/);
      expect(element.all(by.id('authuser')).first().getText()).
        toMatch(/admin/);
    });

  });

  describe('create_user', function() {

    beforeEach(function() {
      browser.get('#!/create_user');
    });

    it('should render create user page when user navigates to /create_user', function() {
      expect(element.all(by.css('[ng-view] h3')).first().getText()).
        toMatch(/Create a User Account/);
    });

  });

});

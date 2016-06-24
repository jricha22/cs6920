//jshint strict: false
module.exports = function(config) {
  config.set({

    basePath: './app',

    files: [
      'bower_components/angular/angular.js',
      'bower_components/angular-route/angular-route.js',
      'bower_components/angular-mocks/angular-mocks.js',
        //trying to get ui.bootstrap to be recognized starting here
      '//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js',
      '//cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/1.3.3/ui-bootstrap.js',
      '//cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/1.3.3/ui-bootstrap-tpls.js',
        //end of scripts added for ui.bootstrap issue
      'app.js',
      'app/**/*.module.js',
      'components/version/*.js',
      'view*/**/*.js',
      'login/**/*.js'
    ],

    autoWatch: true,

    frameworks: ['jasmine'],

    browsers: ['Chrome'],

    plugins: [
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-jasmine',
      'karma-junit-reporter'
    ],

    junitReporter: {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};

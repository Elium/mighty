'use strict';

var pkg = require('./package.json');
var _ = require('lodash');

module.exports = function (grunt) {

  // load all grunt tasks
  require('time-grunt')(grunt);
  require('load-grunt-tasks')(grunt);

  var config = {
    files: {
      app: [
        "src/**/*.module.ts",
        "src/**/*.ts",
        "!src/**/*.spec.ts"
      ]
    }
  };

  // Project configuration.
  grunt.initConfig({
    pkg: pkg,
    ts: {
      lib: {
        src: config.files.app,
        dest: "dist/" + pkg.appName + ".js"
      },
      watch: {
        watch: config.files.app,
        src: config.files.app,
        dest: "dist/" + pkg.appName + ".js"
      }
    },
    clean: {
      dist: {
        src: ["dist/" + pkg.appName + "*"]
      }
    },
    karma: {
      options: {
        frameworks: ['jasmine'],
        files: [
          'src/**/*.spec.ts'
        ],
        browsers: ['PhantomJS'],
        logLevel: 'ERROR',
        reporters: ['mocha'],
        plugins: [
          'karma-jasmine',
          'karma-typescript-preprocessor',
          'karma-phantomjs-launcher',
          'karma-mocha-reporter'
        ],
        typescriptPreprocessor: {
          options: {
            sourceMap: false,
            target: 'ES5',
            module: 'amd',
            noImplicitAny: true,
            noResolve: true,
            removeComments: true
          },
          transformPath: function(path) {
            return path.replace(/\.ts$/, '.js');
          }
        },
        autoWatch: false
      },
      unit: {
        singleRun: true
      },
      continuous: {
        autoWatch: true,
        singleRun: false
      }
    },

    bump: {
      options: {
        files: ['package.json'],
        updateConfigs: [],
        commit: true,
        commitMessage: 'Release v%VERSION%',
        commitFiles: ['package.json'],
        createTag: true,
        tagName: 'v%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: true,
        pushTo: 'origin',
        gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
        globalReplace: false,
        prereleaseName: false,
        regExp: false
      }
    },

    changelog: {
      options: {
        dest: "CHANGELOG.md"
      }
    }
  });

  grunt.registerTask('build', ["clean", "ts:lib"]);
  grunt.registerTask('watch', ["clean", "ts:watch"]);
  grunt.registerTask('test:unit', ['karma:unit']);
  grunt.registerTask('test:continuous', ['karma:continuous']);
  grunt.registerTask('release', function(type) {
    grunt.task.run(["changelog", "bump" + (type ? ":" + type : "")]);
  });
  grunt.registerTask('ci', "test:unit", "build");
  grunt.registerTask('default', "build");
};

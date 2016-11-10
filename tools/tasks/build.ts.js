"use strict";

const gulp = require("gulp");
const config = require("../config");
const ts = require("gulp-typescript");
const merge = require("merge2");
const sourcemaps = require('gulp-sourcemaps');

const tsProject = ts.createProject(__dirname + "/../../tsconfig.json");

module.exports = () => {
  const tsResult = tsProject.src()
    .pipe(sourcemaps.init())
    .pipe(tsProject(ts.reporter.longReporter()));

    return merge([
      tsResult.js
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(config.LIB_DIR)),
      tsResult.dts.pipe(gulp.dest(config.LIB_DIR))
    ]);
};

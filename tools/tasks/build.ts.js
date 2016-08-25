"use strict";

const gulp = require("gulp");
const config = require("../config");
const ts = require("gulp-typescript");
const merge = require("merge2");
const sourcemaps = require('gulp-sourcemaps');

const tsProject = ts.createProject(__dirname + "/../../tsconfig.json", {
  sortOutput: true
}, ts.reporter.longReporter());

module.exports = () => {
  const tsResult = gulp.src([
      `${config.TYPINGS_DIR}/**/*.d.ts`,
      `${config.SRC_DIR}/**/*.d.ts`,
      `${config.SRC_DIR}/**/*.ts`,
      `${config.TEST_DIR}/**/*.d.ts`,
      `${config.TEST_DIR}/**/*.ts`
    ])
    .pipe(sourcemaps.init())
    .pipe(ts(tsProject));

    return merge([
      tsResult.js
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(config.LIB_DIR)),
      tsResult.dts.pipe(gulp.dest(config.LIB_DIR))
    ]);
};

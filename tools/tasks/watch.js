"use strict";

const gulp = require("gulp");
const config = require("../config");

module.exports = (done) => {
  gulp.watch([
    `${config.SRC_DIR}/**/*.ts`,
    `${config.TEST_DIR}/**/*.ts`
  ], ["build.ts"]);
  done();
};
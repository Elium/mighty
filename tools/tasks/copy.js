"use strict";

const gulp = require("gulp");
const config = require("../config");

module.exports = () => {
  return gulp.src([`${config.PROJECT_ROOT}/package.json`])
    .pipe(gulp.dest(`${config.LIB_DIR}/src/`))
};

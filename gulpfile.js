"use strict";

const gulp = require("gulp");
const runSequence = require("run-sequence");
const registerTasks = require("./tools/utils/registerTasks");

registerTasks();

gulp.task("build", (done) => {
  return runSequence(
    "clean",
    "build.ts",
    "copy",
    done
  );
});

gulp.task("dev", (done) => {
  return runSequence(
    "build",
    "watch",
    done
  );
});

gulp.task("default", ["dev"]);

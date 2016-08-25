"use strict";

const config = require("../config");
const fs = require("fs");
const gulp = require("gulp");

module.exports = () => {
  const tasksFiles = fs.readdirSync(config.TASKS_DIR);
  tasksFiles.forEach((taskFile) => {
    const taskName = taskFile.substring(0, taskFile.lastIndexOf(".js"));
    const task = require(`${config.TASKS_DIR}/${taskFile}`);
    gulp.task(taskName, task);
  });
};
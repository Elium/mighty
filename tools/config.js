"use strict";

const path = require("path");

class Config {
  constructor() {
    this.PROJECT_ROOT = path.join(__dirname, '..');
    this.LIB_DIR = `${this.PROJECT_ROOT}/lib`;
    this.SRC_DIR = `${this.PROJECT_ROOT}/src`;
    this.TEST_DIR = `${this.PROJECT_ROOT}/test`;
    this.TYPINGS_DIR = `${this.PROJECT_ROOT}/typings`;
    this.NODE_MODULES_DIR = `${this.PROJECT_ROOT}/node_modules`;

    this.TOOLS_DIR= `${this.PROJECT_ROOT}/tools`;
    this.TASKS_DIR= `${this.TOOLS_DIR}/tasks`;
  }
}

module.exports = new Config();
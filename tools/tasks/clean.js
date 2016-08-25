"use strict";

const config = require('../config');
const del  = require("del");

module.exports = () => {
  return del([config.LIB_DIR]);
};

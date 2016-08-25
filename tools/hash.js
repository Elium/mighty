"use strict";

const bcrypt = require("bcrypt");
const argv = process.argv;

if(argv.length > 2) {
  const password = argv[2];
  console.log(bcrypt.hashSync(password, 10));
  process.exit(0);
} else {
  console.error("No enough params");
  process.exit(1);
}
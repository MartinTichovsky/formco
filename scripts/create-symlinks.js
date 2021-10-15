const fs = require("fs");
const path = require("path");

const nodeModules = "./node_modules";
const jestPath = path.resolve(`${nodeModules}/jest`);

if (!fs.existsSync(nodeModules)) {
  fs.mkdirSync(nodeModules);
}

// in windows the jest runner does not resolve the path of jest correctly, so
// it is needed to create a symlink in the package to be able run tests
// using jest runner
if (!fs.existsSync(jestPath)) {
  fs.symlinkSync(path.resolve("../../node_modules/jest"), jestPath, "junction");
}

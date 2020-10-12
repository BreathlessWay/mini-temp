const { src, dest, series } = require("gulp"),
  babel = require("gulp-babel"),
  ts = require("gulp-typescript");

const tsProject = ts.createProject("tsconfig.json");

const parseTs = () => {
  return src("src/**/*.ts").pipe(tsProject()).pipe(babel()).pipe(dest("dist"));
};

const copyHelpers = () => {
  return src("src/helpers/*.js").pipe(dest("dist/helpers"));
};

const copyWxml = () => {
  return src("src/**/*.wxml").pipe(dest("dist"));
};

const copyWxss = () => {
  return src("src/**/*.wxss").pipe(dest("dist"));
};

const copyJson = () => {
  return src("src/**/*.json").pipe(dest("dist"));
};

exports.default = series(parseTs, copyHelpers, copyWxml, copyWxss, copyJson);

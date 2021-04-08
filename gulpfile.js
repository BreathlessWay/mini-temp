const { src, dest, watch, series } = require("gulp"),
  babel = require("gulp-babel"),
  rename = require("gulp-rename"),
  minifyHtml = require("gulp-html-minify");

const cleanCSS = require("gulp-clean-css");
const ts = require("gulp-typescript");
const sass = require("gulp-sass");
const less = require("gulp-less");

const outputPath = process.env.output;

const isDEV = process.env.NODE_ENV === "development",
  isPROD = process.env.NODE_ENV === "production";

const inputEnvConfigPath = `src/config/${process.env.NODE_ENV}.ts`,
  outputEnvConfigPath = `${outputPath}/config`;

const fileInputPath = {
  helpers: "src/helpers/*.js",
  wxml: "src/**/*.wxml",
  config: "src/**/*.json",
  images: "src/images/**/*",
  fonts: "src/fonts/**/*",

  ts: ["src/**/*.ts", "!src/config/*.ts"],
  js: ["src/**/*.js", "!src/helpers/*.js", "!src/config/*.js"],

  wxss: "src/**/*.wxss",
  css: "src/**/*.css",
  less: "src/**/*.less",
  sass: "src/**/*.+(scss|sass)",
};

const minifyCss = cleanCSS({
  format: isDEV ? "beautify" : "keep-breaks",
});

const parseTs = () => {
  return src(fileInputPath.ts)
    .pipe(ts.createProject("tsconfig.json")())
    .pipe(babel())
    .pipe(dest(outputPath));
};

const parseJs = () => {
  return src(fileInputPath.js).pipe(babel()).pipe(dest(outputPath));
};

const copyHelpers = () => {
  return src(fileInputPath.helpers).pipe(dest(`${outputPath}/helpers`));
};

const copyImages = () => {
  return src(fileInputPath.images).pipe(dest(outputPath));
};

const copyFonts = () => {
  return src(fileInputPath.fonts).pipe(dest(outputPath));
};

const parseWxml = () => {
  return src(fileInputPath.wxml).pipe(minifyHtml()).pipe(dest(outputPath));
};

const copyWxss = () => {
  return src(fileInputPath.wxss).pipe(minifyCss).pipe(dest(outputPath));
};

const parseCss = () => {
  return src(fileInputPath.css)
    .pipe(minifyCss)
    .pipe(rename({ extname: ".wxss" }))
    .pipe(dest(outputPath));
};

const parseSass = () => {
  return src(fileInputPath.sass)
    .pipe(
      sass({
        outputStyle: isDEV ? "expanded" : "compressed",
      }).on("error", sass.logError)
    )
    .pipe(rename({ extname: ".wxss" }))
    .pipe(dest(outputPath));
};

const parseLess = () => {
  return src(fileInputPath.less)
    .pipe(
      less({
        compress: isPROD,
      })
    )
    .pipe(rename({ extname: ".wxss" }))
    .pipe(dest(outputPath));
};

const copyJson = () => {
  return src(fileInputPath.config).pipe(dest(outputPath));
};

const generatorEnvConfig = () => {
  return src(inputEnvConfigPath)
    .pipe(ts.createProject("tsconfig.json")())
    .pipe(babel())
    .pipe(rename("env.js"))
    .pipe(dest(outputEnvConfigPath));
};

const watchFile = () => {
  watch(fileInputPath.ts, parseTs);
  watch(fileInputPath.js, parseJs);

  watch(fileInputPath.helpers, copyHelpers);
  watch(fileInputPath.wxml, parseWxml);
  watch(fileInputPath.images, copyImages);
  watch(fileInputPath.fonts, copyFonts);

  watch(fileInputPath.wxss, copyWxss);
  watch(fileInputPath.css, parseCss);
  watch(fileInputPath.sass, parseSass);
  watch(fileInputPath.less, parseLess);

  watch(fileInputPath.config, copyJson);
};

const build = series(
  // parseTs,
  parseJs,
  copyHelpers,
  parseWxml,
  copyWxss,
  // parseCss,
  // parseSass,
  // parseLess,
  copyJson,
  copyImages,
  copyFonts,
  generatorEnvConfig
);

if (isDEV) {
  exports.watch = watchFile();
}

exports.default = build;

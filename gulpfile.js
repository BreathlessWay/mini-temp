const { src, dest, watch, series } = require("gulp"),
  babel = require("gulp-babel"),
  cleanCSS = require("gulp-clean-css"),
  del = require("del"),
  ts = require("gulp-typescript"),
  rename = require("gulp-rename"),
  sass = require("gulp-sass"),
  less = require("gulp-less");

const outputPath = "dist";

const isDEV = process.env.NODE_ENV === "development",
  isPROD = process.env.NODE_ENV === "production";

const inputEnvConfigPath = `src/config/${process.env.NODE_ENV}.ts`,
  outputEnvConfigPath = `${outputPath}/config`;

const fileInputPath = {
  ts: ["src/**/*.ts", "!src/config/*.ts"],
  js: ["src/**/*.js", "!src/helpers/*.js"],
  helpers: "src/helpers/*.js",
  wxml: "src/**/*.wxml",
  wxss: "src/**/*.wxss",
  css: "src/**/*.css",
  less: "src/**/*.less",
  sass: "src/**/*.+(scss|sass)",
  config: "src/**/*.json",
  images: "src/images/**/*",
};

const minifyCss = cleanCSS({
  format: isDEV ? "beautify" : "keep-breaks",
});

const tsProject = ts.createProject("tsconfig.json");

const clean = () => {
  return del([outputPath]);
};

const parseTs = () => {
  return src(fileInputPath.ts)
    .pipe(tsProject())
    .pipe(babel())
    .pipe(dest(outputPath));
};

const parseJs = () => {
  return src(fileInputPath.js).pipe(babel()).pipe(dest(outputPath));
};

const copyHelpers = () => {
  return src(fileInputPath.helpers).pipe(dest(`${outputPath}/helpers`));
};

const copyWxml = () => {
  return src(fileInputPath.wxml).pipe(dest(outputPath));
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
    .pipe(
      ts({
        target: 'es5',
        module: "commonjs",
      })
    ).
      pipe(rename('env.js'))
    .pipe(dest(outputEnvConfigPath));
};

const watchFile = () => {
  watch(fileInputPath.ts, parseTs);
  watch(fileInputPath.js, parseJs);

  watch(fileInputPath.helpers, copyHelpers);
  watch(fileInputPath.wxml, copyWxml);

  watch(fileInputPath.wxss, copyWxss);
  watch(fileInputPath.css, parseCss);
  watch(fileInputPath.sass, parseSass);
  watch(fileInputPath.less, parseLess);

  watch(fileInputPath.config, copyJson);
};

let build = series(
  parseTs,
  parseJs,
  copyHelpers,
  copyWxml,
  copyWxss,
  parseCss,
  parseSass,
  parseLess,
  copyJson,
  generatorEnvConfig
);

if (isDEV) {
  exports.watch = watchFile();
}

if (isPROD) {
  build = series(clean, build);
}

exports.default = build;

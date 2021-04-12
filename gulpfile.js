const path = require("path"),
  fs = require("fs");

const { src, dest, watch, parallel, lastRun } = require("gulp"),
  babel = require("gulp-babel"),
  rename = require("gulp-rename"),
  sourcemaps = require("gulp-sourcemaps"),
  gulpIf = require("gulp-if"),
  pump = require("pump"),
  gulpImage = require("gulp-image"),
  cache = require("gulp-cache"),
  prettyData = require("gulp-pretty-data");

const cleanCSS = require("gulp-clean-css");
const sass = require("gulp-sass");
const less = require("gulp-less");

const since = (task) => (file) =>
  lastRun(task) > file.stat.ctime ? lastRun(task) : 0;

let outputPath = process.env.output;

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

const parseTs = (cb) => {
  const tsResult = src(fileInputPath.ts, { since: since(parseTs) })
    .pipe(gulpIf(isDEV, sourcemaps.init()))
    .pipe(babel())
    .on("error", () => {
      // 捕获错误，不添加会因为编译错误导致任务中断
      /** 忽略编译器错误**/
    });
  pump([tsResult, gulpIf(isDEV, sourcemaps.write(".")), dest(outputPath)], cb);
};

const parseJs = (cb) => {
  const jsResult = src(fileInputPath.js, { since: since(parseJs) })
    .pipe(gulpIf(isDEV, sourcemaps.init()))
    .pipe(babel());
  pump([jsResult, gulpIf(isDEV, sourcemaps.write(".")), dest(outputPath)], cb);
};

const copyHelpers = () => {
  return src(fileInputPath.helpers, { since: since(copyHelpers) }).pipe(
    dest(`${outputPath}/helpers`)
  );
};

const copyImages = () => {
  return src(fileInputPath.images, { since: since(copyImages) })
    .pipe(cache(gulpImage()))
    .pipe(dest(outputPath));
};

const copyFonts = () => {
  return src(fileInputPath.fonts, { since: since(copyFonts) }).pipe(
    dest(outputPath)
  );
};

const copyWxml = () => {
  return src(fileInputPath.wxml, { since: since(copyWxml) })
    .pipe(
      prettyData({
        type: isDEV ? "prettify" : "minify",
        extensions: {
          wxml: "xml",
        },
      })
    )
    .pipe(dest(outputPath));
};

const copyWxss = () => {
  return src(fileInputPath.wxss, { since: since(copyWxss) })
    .pipe(minifyCss)
    .pipe(dest(outputPath));
};

const parseCss = () => {
  return src(fileInputPath.css, { since: since(parseCss) })
    .pipe(minifyCss)
    .pipe(rename({ extname: ".wxss" }))
    .pipe(dest(outputPath));
};

const parseSass = () => {
  return src(fileInputPath.sass, { since: since(parseSass) })
    .pipe(
      sass({
        outputStyle: isDEV ? "expanded" : "compressed",
      }).on("error", sass.logError)
    )
    .pipe(rename({ extname: ".wxss" }))
    .pipe(dest(outputPath));
};

const parseLess = (cb) => {
  pump(
    [
      src(fileInputPath.less, { since: since(parseLess) }),
      gulpIf(isDEV, sourcemaps.init()),
      less({
        compress: isPROD,
      }),
      gulpIf(isDEV, sourcemaps.write(".")),
      rename({ extname: ".wxss" }),
      dest(outputPath),
    ],
    cb
  );
};

const copyJson = () => {
  return src(fileInputPath.config, { since: since(copyJson) })
    .pipe(
      prettyData({
        type: isDEV ? "prettify" : "minify",
        extensions: {
          json: "json",
        },
      })
    )
    .pipe(dest(outputPath));
};

const generatorEnvConfig = () => {
  return src(inputEnvConfigPath, { since: since(generatorEnvConfig) })
    .pipe(babel())
    .pipe(rename("env.js"))
    .pipe(dest(outputEnvConfigPath));
};

const watchFile = () => {
  console.log(`正在监听文件...`);
  const watcher = watch("src/**/**");

  watcher.on("change", function (filePath, stats) {
    console.log("文件修改", filePath);
  });

  watcher.on("add", function (filePath, stats) {
    console.log("文件添加", filePath);
  });

  watcher.on("unlink", function (filePath, stats) {
    console.log("文件删除", filePath);
    let _outputPath = outputPath;
    if (_outputPath.endsWith("/")) {
      _outputPath = _outputPath.substr(0, _outputPath.length - 1);
    }
    let distFile = filePath.replace(/^src\b/, _outputPath);

    if (distFile.endsWith(".ts")) {
      distFile = distFile.replace(/\.ts$/, ".js");
    }
    if (distFile.endsWith(".scss") || distFile.endsWith(".sass")) {
      distFile = distFile.replace(/(\.scss|\.sass)$/, ".wxss");
    }
    if (distFile.endsWith(".less")) {
      distFile = distFile.replace(/\.less$/, ".wxss");
    }
    if (distFile.endsWith(".css")) {
      distFile = distFile.replace(/\.css$/, ".wxss");
    }

    distFile = path.join(process.cwd(), distFile);
    if (fs.existsSync(distFile)) {
      fs.unlinkSync(distFile);
    }
  });

  watch(fileInputPath.ts, parseTs);
  watch(fileInputPath.js, parseJs);

  watch(fileInputPath.helpers, copyHelpers);
  watch(fileInputPath.wxml, copyWxml);
  watch(fileInputPath.images, copyImages);
  watch(fileInputPath.fonts, copyFonts);

  watch(fileInputPath.wxss, copyWxss);
  watch(fileInputPath.css, parseCss);
  watch(fileInputPath.sass, parseSass);
  watch(fileInputPath.less, parseLess);

  watch(fileInputPath.config, copyJson);
};

const build = parallel(
  // parseTs,
  parseJs,
  copyHelpers,
  copyWxml,
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

const shelljs = require("shelljs"),
    path = require('path')

const NODE_ENV = process.env.NODE_ENV,
  isPROD = process.env.NODE_ENV === "production";

const outputPath = 'dist'

const mkdirPath = path.resolve(__dirname, '../dist');

if (isPROD) {
    shelljs.rm('-rf', mkdirPath);
}

shelljs.mkdir(mkdirPath);

shelljs.exec("npm run build:npm");

shelljs.exec(`cross-env NODE_ENV=${NODE_ENV} && cross-env output=${outputPath} gulp`);

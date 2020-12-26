import shelljs from "shelljs";
import path from "path";

import config from "./config";

const NODE_ENV = process.env.NODE_ENV,
  isPROD = process.env.NODE_ENV === "production";

const mkdirPath = path.resolve(__dirname, `../${config.outputPath}`);

if (isPROD) {
  shelljs.rm("-rf", mkdirPath);
}

shelljs.mkdir(mkdirPath);

shelljs.exec("npm run build:npm");

shelljs.exec(
  `cross-env NODE_ENV=${NODE_ENV} && cross-env output=${config.outputPath} gulp`,
  (code, stdout, stderr) => {
    console.log("gulp Exit code:", code);
    console.log("gulp stdout:", stdout);
    console.log("gulp stderr:", stderr);
  }
);

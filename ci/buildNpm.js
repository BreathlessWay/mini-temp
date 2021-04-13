const shelljs = require("shelljs"),
  path = require("path"),
  config = require("./config");

if (config.cliPath) {
  const pwd = process.cwd();

  const cmd = `${config.cliPath} build-npm --project ${pwd}`;

  shelljs.exec(cmd, (code, stdout, stderr) => {
    console.log("buildNpm Exit code:", code);
    console.log("buildNpm stdout:", stdout);
    console.log("buildNpm stderr:", stderr);
  });
}

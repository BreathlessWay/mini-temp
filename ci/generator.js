const shelljs = require("shelljs"),
  fs = require("fs");

const helpersWhiteList = [
  "typeof",
  "asyncIterator",
  "asyncGenerator",
  "asyncGeneratorDelegate",
  "asyncToGenerator",
  "classCallCheck",
  "createClass",
  "defineEnumerableProperties",
  "defaults",
  "defineProperty",
  "extends",
  "get",
  "inherits",
  "instanceof",
  "interopRequireDefault",
  "interopRequireWildcard",
  "newArrowCheck",
  "objectDestructuringEmpty",
  "objectWithoutProperties",
  "possibleConstructorReturn",
  "selfGlobal",
  "set",
  "slicedToArray",
  "slicedToArrayLoose",
  "taggedTemplateLiteral",
  "taggedTemplateLiteralLoose",
  "temporalRef",
  "temporalUndefined",
  "toArray",
  "toConsumableArray",
];

const helperPath = "helpers/index.js",
  runtimePath = "helpers/runtime.js";

shelljs.exec(
  `babel-external-helpers -t global -l ${helpersWhiteList} > src/${helperPath}`
);

shelljs.cp(
  "-f",
  "node_modules/regenerator-runtime/runtime.js",
  `src/${runtimePath}`
);

const warningTip = "// 在最顶层引入 不可删除\n";

const helpImport = `import "./${runtimePath}"
import "./${helperPath}"
`;

fs.readFile("src/app.ts", (err, data) => {
  if (err) {
    return err;
  }

  const text = data.toString();

  if (text.includes(helpImport)) {
    return;
  }

  fs.writeFile(
    "src/app.ts",
    warningTip + helpImport + "\n" + data.toString(),
    (err1) => {
      if (err1) {
        return err;
      }
    }
  );
});

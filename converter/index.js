const babelParser = require("@babel/parser");
const fs = require("fs-extra");
const path = require("path");
const processScreen = require("./processScreen");
const processModule = require("./processModule");
const { createScreenDir } = require("./createScreenDir");

const tempFolderPath = path.resolve("./temp");
console.log(tempFolderPath);

const fileFolderPath = "./nativebase-pro/storybook/storybook/stories";
console.log(fileFolderPath);

const modulesPath = fileFolderPath + "/modules";
console.log("%c&*&: yo", "color: #10b981;", modulesPath);

const moduleDirContents = fs.readdirSync(modulesPath);
// console.log(moduleDirContents, "moduleDirContents &*&*");

const moduleNames = moduleDirContents.filter((fileName) => {
  const stat = fs.statSync(modulesPath + "/" + fileName);

  return stat.isDirectory();
});

const screenPathMap = {};
let storybookScreens = {
  screens: [],
  components: [],
  assets: [],
};

function getStoryBookScreensCode() {
  console.log("%c&*&: gu", "color: #10b981;");
  moduleNames.forEach((moduleName, index) => {
    const modulePath = modulesPath + "/" + moduleName;
    console.log("%c &*& modulePath", "color: #10b981;", modulePath);
    let moduleScreenMap = processModule(modulePath);

    for (let key of Object.keys(moduleScreenMap)) {
      if (key.includes("/")) {
        moduleScreenMap[key.slice(key.lastIndexOf("/") + 1)] =
          moduleScreenMap[key];
        delete moduleScreenMap[key];
      }
    }

    // console.log("%c &*& moduleScreenMap", "color: #10b981;", moduleScreenMap);

    for (const screenName in moduleScreenMap) {
      screenPathMap[screenName] = moduleScreenMap[screenName].replace(
        "./",
        modulePath + "/"
      );
    }

    Object.keys(moduleScreenMap).forEach((screenName) => {
      // console.log(screenName, "screenName &*&*");
      const code = fs.readFileSync(
        modulePath + "/" + moduleScreenMap[screenName] + ".tsx",
        "utf-8"
      );
      const screenObject = {
        name: screenName,
        code: code,
        dependencies: [],
      };

      processScreen(storybookScreens, screenObject);

      storybookScreens.screens.push(screenObject);
    });
  });

  // console.log("%c &*& storybookScreens", "color: #10b981;", storybookScreens);
  return storybookScreens;
}

// console.log(
//   JSON.stringify(
//     [...storybookScreens.screens, ...storybookScreens.components].map((s) => ({
//       name: s.name,
//       deps: s.dependencies,
//     })),
//     null,
//     2
//   ),
//   "storybookScreens &*&*"
// );

// console.log(storybookScreens, "storybookScreens &*&*");

function writeCodeToFiles() {
  if (!fs.existsSync(tempFolderPath + "/output")) {
    fs.mkdirSync(tempFolderPath + "/output");
  }

  fs.writeFileSync(
    tempFolderPath + "/output/screens.json",
    JSON.stringify(storybookScreens.screens, null, 2)
  );
  fs.writeFileSync(
    tempFolderPath + "/output/components.json",
    JSON.stringify(storybookScreens.components, null, 2)
  );
  fs.writeFileSync(
    tempFolderPath + "/output/assets.json",
    JSON.stringify(storybookScreens.assets, null, 2)
  );
}

module.exports.getStoryBookScreensCode = getStoryBookScreensCode;
module.exports.writeCodeToFiles = writeCodeToFiles;
module.exports.createScreenDir = createScreenDir;
// console.log("%c &*& screen", "color: #10b981;", screenPathMap);

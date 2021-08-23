const fs = require("fs-extra");
const { createMainFile } = require("./createMainFile");

const toKebabCase = (str) =>
  str &&
  str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .map((x) => x.toLowerCase())
    .join("-");

function createScreenDir(screenJSON, template = "expo", extension = "js") {
  createMainFile(screenJSON.screens, template, extension);
  let screenDirPath = "./screens";

  switch (template) {
    case "expo":
      screenDirPath = process.cwd() + "/native-base-starter/screens";
      break;
    case "next":
      screenDirPath = process.cwd() + "/native-base-starter/pages";
      break;
    case "crna":
      screenDirPath = process.cwd() + "/native-base-starter/screens";
      break;
  }

  if (!fs.existsSync(screenDirPath)) {
    fs.mkdirSync(screenDirPath);
  }

  screenJSON.screens.forEach((screen) => {
    let screenName = screen.name;

    if (template === "next") {
      screenName = toKebabCase(screenName);
    }

    const screenFilePath = `${screenDirPath}/${screenName}`;

    if (!fs.existsSync(screenFilePath)) {
      fs.mkdirSync(screenFilePath);
    }

    let code = screen.code;

    if (template === "crna") {
      code = (code + "").replace(
        "@expo/vector-icons",
        "react-native-vector-icons"
      );
    }

    fs.writeFileSync(screenFilePath + `/index.${extension}x`, code);

    if (
      screen.dependencies &&
      screen.dependencies.components &&
      screen.dependencies.components.length > 0
    ) {
      const componentDirPath = `${screenFilePath}/Components`;
      if (!fs.existsSync(componentDirPath)) {
        fs.mkdirSync(componentDirPath);
      }

      screen.dependencies.components.forEach((component) => {
        fs.move(
          process.cwd() + "/nativebase-starter-kit/" + component.path,
          componentDirPath + "/" + component.name
        );
      });
    }
  });
}

module.exports.createScreenDir = createScreenDir;

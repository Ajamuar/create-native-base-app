const fs = require("fs-extra");
const { createMainFile } = require("./createMainFile");
const toKebabCase = require("./utils");

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
    case "cra":
      screenDirPath = process.cwd() + "/native-base-starter/src/screens";
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
    let regex = /\/\*.+?\*\//g;
    const functionalityComment = code.match(regex);

    if (template !== "next") {
      if (functionalityComment)
        for (let i = 0; i < functionalityComment.length; i++) {
          if (functionalityComment[i].includes("onPress function")) {
            let navigationScreen = functionalityComment[i].substring(
              functionalityComment[i].indexOf(":") + 1,
              functionalityComment[i].lastIndexOf('"') + 1
            );
            let finalNavigationScreen = navigationScreen.substring(
              1,
              navigationScreen.length - 1
            );
            const onPressFunction =
              "onPress={()=>{props.navigation.navigate('" +
              finalNavigationScreen +
              "')}}";
            code = code.replaceAll(functionalityComment[i], onPressFunction);
          }
        }
    }
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

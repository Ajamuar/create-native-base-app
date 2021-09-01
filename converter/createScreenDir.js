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
    if (template === "expo" || template == "crna") {
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
    } else {
      if (template == "next") {
        code = "import NextLink from 'next/link'\n" + code;
        if (functionalityComment) {
          let closingLinkTag = "</NextLink>";
          for (let i = 0; i < functionalityComment.length; i++) {
            if (functionalityComment[i].includes("Closing Link Tag")) {
              code = code.replaceAll(
                "{" + functionalityComment[i] + "}",
                closingLinkTag
              );
            } else if (functionalityComment[i].includes("Opening Link Tag")) {
              let navigationScreen = functionalityComment[i].substring(
                functionalityComment[i].indexOf(":") + 1,
                functionalityComment[i].lastIndexOf('"') + 1
              );
              let finalNavigationScreen = navigationScreen.substring(
                1,
                navigationScreen.length - 1
              );

              let openingLinkTag =
                "<NextLink href='/" +
                toKebabCase(finalNavigationScreen).toLowerCase() +
                "'>";

              code = code.replaceAll(
                "{" + functionalityComment[i] + "}",
                openingLinkTag
              );
            }
          }
        }
      } else if (template == "cra") {
        code =
          "import { Route, Link as ReactLink, BrowserRouter } from 'react-router-dom'\n" +
          code;
        if (functionalityComment) {
          let closingLinkTag = "</ReactLink>";
          for (let i = 0; i < functionalityComment.length; i++) {
            if (functionalityComment[i].includes("Closing Link Tag")) {
              code = code.replaceAll(
                "{" + functionalityComment[i] + "}",
                closingLinkTag
              );
            } else if (functionalityComment[i].includes("Opening Link Tag")) {
              let navigationScreen = functionalityComment[i].substring(
                functionalityComment[i].indexOf(":") + 1,
                functionalityComment[i].lastIndexOf('"') + 1
              );
              let finalNavigationScreen = navigationScreen.substring(
                1,
                navigationScreen.length - 1
              );

              let openingLinkTag =
                "<ReactLink to='/" +
                toKebabCase(finalNavigationScreen).toLowerCase() +
                "'>";

              code = code.replaceAll(
                "{" + functionalityComment[i] + "}",
                openingLinkTag
              );
            }
          }
        }
      }
    }

    if (template === "cra") {
      const regex =
        /^import ?\{([a-zA-Z,\n ])*\} ?from ?\"@expo\/vector-icons\";?$/gm;
      const icons = code.match(regex);
      var part = icons[0].substring(
        icons[0].lastIndexOf("{") + 1,
        icons[0].lastIndexOf("}")
      );
      let iconsName = part.split(",");
      let finalImports = "";

      for (let i = 0; i < iconsName.length; i++) {
        iconsName[i] = iconsName[i].replace(/ /g, "");
        iconsName[i] = iconsName[i].replace(/\n/g, "");
        if (iconsName[i])
          finalImports =
            finalImports +
            ("import " +
              iconsName[i] +
              " from 'react-native-vector-icons/dist/" +
              iconsName[i] +
              "';\n");
      }

      code = code.replaceAll(icons[0], finalImports);
    }

    if (template === "crna") {
      const regex =
        /^import ?\{([a-zA-Z,\n ])*\} ?from ?\"@expo\/vector-icons\";?$/gm;
      const icons = code.match(regex);
      var part = icons[0].substring(
        icons[0].lastIndexOf("{") + 1,
        icons[0].lastIndexOf("}")
      );
      let iconsName = part.split(",");
      let finalImports = "";

      for (let i = 0; i < iconsName.length; i++) {
        iconsName[i] = iconsName[i].replace(/ /g, "");
        iconsName[i] = iconsName[i].replace(/\n/g, "");
        if (iconsName[i])
          finalImports =
            finalImports +
            ("import " +
              iconsName[i] +
              " from 'react-native-vector-icons/" +
              iconsName[i] +
              "';\n");
      }

      code = code.replaceAll(icons[0], finalImports);
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

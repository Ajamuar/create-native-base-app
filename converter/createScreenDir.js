const fs = require("fs-extra");
const { createMainFile } = require("./createMainFile");

function createScreenDir(screenJSON) {
  createMainFile(screenJSON.screens);
  let screenDirPath = "./screens";

  let env = "expo";

  switch (env) {
    case "expo":
      screenDirPath = process.cwd() + "/expo-starter/screens";
  }

  const ext = "js";

  if (!fs.existsSync(screenDirPath)) {
    fs.mkdirSync(screenDirPath);
  }

  fs.writeFileSync(process.cwd() + "/test.json", JSON.stringify(screenJSON));

  screenJSON.screens.forEach((screen) => {
    const screenFilePath = `${screenDirPath}/${screen.name}`;

    if (!fs.existsSync(screenFilePath)) {
      fs.mkdirSync(screenFilePath);
    }
    fs.writeFileSync(screenFilePath + `/index.${ext}`, screen.code);
  });
}

module.exports.createScreenDir = createScreenDir;
